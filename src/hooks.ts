import type { VNode } from './vdom';

let currentTile: Tile | null = null;
let nextEffectQueue: (() => void)[] = [];
let cleanupFunctions: (() => void)[] = [];

export interface Tile {
  type: Function;
  props: Record<string, any>;
  dom: HTMLElement | Text | null;
  parent: Tile | null;
  children: Tile[];
  hooks: Hook[];
  hookIndex: number;
  vdom: VNode | null;
}

interface Hook {
  type: string;
}

interface SignalHook<T> extends Hook {
  type: 'signal';
  value: T;
  setValue: (newValue: T) => void;
}

interface AfterHook extends Hook {
  type: 'after';
  effect: () => void | (() => void);
  cleanup: (() => void) | null;
  deps?: any[];
}

interface AnchorHook extends Hook {
  type: 'anchor';
  ref: { current: any };
}

export function setCurrentTile(tile: Tile | null) {
  currentTile = tile;
  if (tile) {
    tile.hookIndex = 0;
  }
}

function getAndUpdateCurrentTile() {
  if (!currentTile) {
    throw new Error('Hooks can only be called inside a component function');
  }
  
  const hookIndex = currentTile.hookIndex++;
  return { tile: currentTile, hookIndex };
}

export function useSignal<T>(initialValue: T): [T, (newValue: T) => void] {
  const { tile, hookIndex } = getAndUpdateCurrentTile();
  
  if (hookIndex >= tile.hooks.length) {
    const setValue = (newValue: T) => {
      const hook = tile.hooks[hookIndex] as SignalHook<T>;
      
      // Check for object equality by comparing stringified values
      if (typeof newValue === 'object' && typeof hook.value === 'object') {
        try {
          const isEqual = JSON.stringify(hook.value) === JSON.stringify(newValue);
          if (isEqual) return;
        } catch {
          // Fall back to reference equality if stringify fails
          if (hook.value === newValue) return;
        }
      } else if (hook.value === newValue) {
        return;
      }
      
      hook.value = newValue;
      
      if (tile) {
        requestCascade(tile);
      }
    };
    
    const hook: SignalHook<T> = {
      type: 'signal',
      value: initialValue,
      setValue
    };
    
    tile.hooks.push(hook);
    return [hook.value, hook.setValue];
  }
  
  const hook = tile.hooks[hookIndex] as SignalHook<T>;
  return [hook.value, hook.setValue];
}

export function useAfter(effect: () => void | (() => void), deps?: any[]) {
  const { tile, hookIndex } = getAndUpdateCurrentTile();
  
  if (hookIndex >= tile.hooks.length) {
    const hook: AfterHook = {
      type: 'after',
      effect,
      cleanup: null,
      deps
    };
    
    tile.hooks.push(hook);
    
    nextEffectQueue.push(() => {
      const cleanup = effect();
      if (typeof cleanup === 'function') {
        hook.cleanup = cleanup;
        cleanupFunctions.push(cleanup);
      }
    });
  } else {
    const hook = tile.hooks[hookIndex] as AfterHook;
    
    const depsChanged = !deps || !hook.deps || 
      deps.length !== hook.deps.length ||
      deps.some((dep, i) => dep !== hook.deps?.[i]);
    
    hook.effect = effect;
    
    if (depsChanged) {
      hook.deps = deps;
      nextEffectQueue.push(() => {
        if (hook.cleanup) {
          const index = cleanupFunctions.indexOf(hook.cleanup);
          if (index !== -1) {
            cleanupFunctions.splice(index, 1);
          }
          
          hook.cleanup();
          hook.cleanup = null;
        }
        
        const cleanup = effect();
        if (typeof cleanup === 'function') {
          hook.cleanup = cleanup;
          cleanupFunctions.push(cleanup);
        }
      });
    }
  }
}

export function useAnchor<T = any>(initialValue: T = null as unknown as T) {
  const { tile, hookIndex } = getAndUpdateCurrentTile();
  
  if (hookIndex >= tile.hooks.length) {
    const hook: AnchorHook = {
      type: 'anchor',
      ref: { current: initialValue }
    };
    
    tile.hooks.push(hook);
    return hook.ref;
  }
  
  const hook = tile.hooks[hookIndex] as AnchorHook;
  return hook.ref;
}

export function runEffects() {
  const effects = [...nextEffectQueue];
  nextEffectQueue = [];
  
  for (const effect of effects) {
    try {
      effect();
    } catch (error) {
      console.error('Error running effect:', error);
    }
  }
}

export function cleanupAllEffects() {
  const cleanups = [...cleanupFunctions];
  cleanupFunctions = [];
  
  for (const cleanup of cleanups) {
    try {
      cleanup();
    } catch (error) {
      console.error('Error cleaning up effect:', error);
    }
  }
}

// To be implemented in cascade.ts and imported
let requestCascade: (tile: Tile) => void = () => {
  console.warn('requestCascade not yet connected');
};

export function connectCascade(cascadeFn: (tile: Tile) => void) {
  requestCascade = cascadeFn;
}
