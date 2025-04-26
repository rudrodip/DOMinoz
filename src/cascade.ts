import type { VNode, ComponentFunction } from './vdom';
import { setCurrentTile, runEffects, connectCascade } from './hooks';
import type { Tile } from './hooks';

let rootContainer: HTMLElement | null = null;
let rootTile: Tile | null = null;

type PatchOperation = {
  type: 'CREATE' | 'UPDATE' | 'REMOVE';
  dom?: HTMLElement | Text;
  parent?: HTMLElement;
  tile?: Tile;
  oldTile?: Tile;
  vnode?: VNode;
  oldVNode?: VNode;
  index?: number;
};

export function render(vdom: VNode, container: HTMLElement) {
  if (!rootTile) {
    rootTile = {
      type: vdom.type as Function,
      props: vdom.props,
      dom: null,
      parent: null,
      children: [],
      hooks: [],
      hookIndex: 0,
      vdom: vdom
    };
    
    rootContainer = container;
    
    const operations: PatchOperation[] = [];
    createTileDom(rootTile, operations);
    
    if (rootTile.dom) {
      operations.push({
        type: 'CREATE',
        dom: rootTile.dom,
        parent: container,
        tile: rootTile
      });
    }
    
    dispatch(operations);
  } else {
    const operations: PatchOperation[] = [];
    updateTile(rootTile, vdom, operations);
    dispatch(operations);
  }
  
  // Always run effects after an initial render or update
  runEffects();
}

function createTileDom(tile: Tile, operations: PatchOperation[]): HTMLElement | Text | null {
  const vnode = tile.vdom;
  if (!vnode) return null;
  
  if (typeof vnode.type === 'string') {
    const dom = document.createElement(vnode.type);
    tile.dom = dom;
    
    updateProps(dom, {}, vnode.props);
    
    vnode.children.forEach((child, index) => {
      if (typeof child === 'string') {
        const textNode = document.createTextNode(child);
        dom.appendChild(textNode);
        
        const textTile: Tile = {
          type: () => {}, // Dummy function for text node
          props: {},
          dom: textNode,
          parent: tile,
          children: [],
          hooks: [],
          hookIndex: 0,
          vdom: null
        };
        
        tile.children.push(textTile);
      } else {
        const childTile = createComponentTile(child, tile);
        tile.children.push(childTile);
        createTileDom(childTile, operations);
        
        if (childTile.dom) {
          dom.appendChild(childTile.dom);
        }
      }
    });
    
    return dom;
  } else {
    return renderComponent(tile, operations);
  }
}

function renderComponent(tile: Tile, operations: PatchOperation[]): HTMLElement | Text | null {
  const vnode = tile.vdom;
  if (!vnode) return null;
  
  setCurrentTile(tile);
  
  const componentFunction = vnode.type as ComponentFunction;
  const renderedVNode = componentFunction(vnode.props);
  
  setCurrentTile(null);
  
  const childTile = createComponentTile(renderedVNode, tile);
  tile.children = [childTile];
  
  const dom = createTileDom(childTile, operations);
  
  tile.dom = dom;
  
  return dom;
}

function createComponentTile(vnode: VNode, parent: Tile): Tile {
  return {
    type: vnode.type as Function,
    props: vnode.props,
    dom: null,
    parent,
    children: [],
    hooks: [],
    hookIndex: 0,
    vdom: vnode
  };
}

function updateProps(dom: HTMLElement, oldProps: Record<string, any>, newProps: Record<string, any>) {
  Object.keys(oldProps).forEach(key => {
    if (key === 'children' || key === 'key' || key === 'ref') return;
    
    if (!(key in newProps)) {
      if (key.startsWith('on')) {
        const eventName = key.slice(2).toLowerCase();
        dom.removeEventListener(eventName, oldProps[key]);
      } else if (key === 'style') {
        (dom as HTMLElement).style.cssText = '';
      } else {
        dom.removeAttribute(key);
      }
    }
  });
  
  // Handle refs
  if (newProps.ref && typeof newProps.ref === 'object' && 'current' in newProps.ref) {
    newProps.ref.current = dom;
  }
  
  Object.keys(newProps).forEach(key => {
    if (key === 'children' || key === 'key' || key === 'ref') return;
    
    if (oldProps[key] !== newProps[key]) {
      if (key.startsWith('on')) {
        const eventName = key.slice(2).toLowerCase();
        
        if (oldProps[key]) {
          dom.removeEventListener(eventName, oldProps[key]);
        }
        
        dom.addEventListener(eventName, newProps[key]);
      } else if (key === 'style') {
        const styleObj = newProps[key];
        
        if (typeof styleObj === 'string') {
          dom.style.cssText = styleObj;
        } else {
          Object.keys(styleObj).forEach(styleName => {
            (dom.style as any)[styleName] = styleObj[styleName];
          });
        }
      } else {
        if (newProps[key] === true) {
          dom.setAttribute(key, '');
        } else if (newProps[key] === false || newProps[key] === null || newProps[key] === undefined) {
          dom.removeAttribute(key);
        } else if (typeof newProps[key] === 'object') {
          // Skip setting object values as attributes
          // This prevents [object Object] string from appearing in the DOM
        } else {
          dom.setAttribute(key, newProps[key]);
        }
      }
    }
  });
}

function updateTile(tile: Tile, newVNode: VNode, operations: PatchOperation[]) {
  const oldVNode = tile.vdom;
  
  tile.vdom = newVNode;
  
  if (!oldVNode) {
    createTileDom(tile, operations);
    return;
  }
  
  if (typeof oldVNode.type !== typeof newVNode.type) {
    replaceTile(tile, newVNode, operations);
    return;
  }
  
  if (typeof newVNode.type === 'string') {
    if (oldVNode.type !== newVNode.type) {
      replaceTile(tile, newVNode, operations);
      return;
    }
    
    if (tile.dom) {
      updateProps(tile.dom as HTMLElement, oldVNode.props, newVNode.props);
      
      operations.push({
        type: 'UPDATE',
        dom: tile.dom as HTMLElement,
        tile,
        vnode: newVNode,
        oldVNode
      });
      
      reconcileChildren(tile, newVNode.children, operations);
    }
  } else {
    if (oldVNode.type !== newVNode.type) {
      replaceTile(tile, newVNode, operations);
      return;
    }
    
    tile.props = newVNode.props;
    
    setCurrentTile(tile);
    
    const componentFunction = newVNode.type as ComponentFunction;
    const newRenderedVNode = componentFunction(newVNode.props);
    
    setCurrentTile(null);
    
    if (tile.children.length > 0) {
      updateTile(tile.children[0], newRenderedVNode, operations);
    } else {
      const childTile = createComponentTile(newRenderedVNode, tile);
      tile.children = [childTile];
      createTileDom(childTile, operations);
    }
  }
}

function replaceTile(tile: Tile, newVNode: VNode, operations: PatchOperation[]) {
  const parent = tile.parent;
  const dom = tile.dom;
  
  if (!parent || !dom) return;
  
  // Clean up refs when removing a tile
  if (tile.vdom && tile.vdom.props.ref && typeof tile.vdom.props.ref === 'object' && 'current' in tile.vdom.props.ref) {
    tile.vdom.props.ref.current = null;
  }
  
  operations.push({
    type: 'REMOVE',
    dom,
    parent: parent.dom as HTMLElement,
    oldTile: tile
  });
  
  const newTile: Tile = {
    type: newVNode.type as Function,
    props: newVNode.props,
    dom: null,
    parent,
    children: [],
    hooks: [],
    hookIndex: 0,
    vdom: newVNode
  };
  
  const index = parent.children.indexOf(tile);
  if (index !== -1) {
    parent.children[index] = newTile;
  }
  
  createTileDom(newTile, operations);
  
  if (newTile.dom) {
    operations.push({
      type: 'CREATE',
      dom: newTile.dom,
      parent: parent.dom as HTMLElement,
      index
    });
  }
}

function reconcileChildren(tile: Tile, newChildren: (VNode | string)[], operations: PatchOperation[]) {
  const dom = tile.dom as HTMLElement;
  const oldChildren = tile.children;
  const newChildTiles: Tile[] = [];
  
  const oldKeyedChildren = new Map<string | number, Tile>();
  
  oldChildren.forEach(child => {
    const key = child.vdom?.key;
    if (key !== undefined) {
      oldKeyedChildren.set(key, child);
    }
  });
  
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const key = typeof newChild === 'object' ? newChild.key : undefined;
    
    let childTile: Tile | undefined;
    
    if (key !== undefined) {
      childTile = oldKeyedChildren.get(key);
      if (childTile) {
        oldKeyedChildren.delete(key);
      }
    }
    
    if (!childTile && i < oldChildren.length) {
      // Only use this child if it doesn't have a key
      const oldChild = oldChildren[i];
      if (oldChild.vdom?.key === undefined) {
        childTile = oldChild;
      }
    }
    
    if (childTile) {
      if (typeof newChild === 'string') {
        if (childTile.dom && childTile.dom.nodeType === Node.TEXT_NODE) {
          if ((childTile.dom as Text).nodeValue !== newChild) {
            (childTile.dom as Text).nodeValue = newChild;
            
            operations.push({
              type: 'UPDATE',
              dom: childTile.dom as Text,
              tile: childTile
            });
          }
        } else {
          const textNode = document.createTextNode(newChild);
          
          if (childTile.dom) {
            operations.push({
              type: 'REMOVE',
              dom: childTile.dom as HTMLElement | Text,
              parent: dom,
              oldTile: childTile
            });
          }
          
          operations.push({
            type: 'CREATE',
            dom: textNode,
            parent: dom,
            index: i
          });
          
          childTile.dom = textNode;
          childTile.children = [];
          childTile.vdom = null;
        }
      } else {
        updateTile(childTile, newChild, operations);
      }
    } else {
      if (typeof newChild === 'string') {
        const textNode = document.createTextNode(newChild);
        
        operations.push({
          type: 'CREATE',
          dom: textNode,
          parent: dom,
          index: i
        });
        
        childTile = {
          type: () => {},
          props: {},
          dom: textNode,
          parent: tile,
          children: [],
          hooks: [],
          hookIndex: 0,
          vdom: null
        };
      } else {
        childTile = createComponentTile(newChild, tile);
        createTileDom(childTile, operations);
        
        if (childTile.dom) {
          operations.push({
            type: 'CREATE',
            dom: childTile.dom,
            parent: dom,
            index: i
          });
        }
      }
    }
    
    newChildTiles.push(childTile);
  }
  
  // Properly remove remaining children that are no longer needed
  for (let i = 0; i < oldChildren.length; i++) {
    const oldChild = oldChildren[i];
    if (!newChildTiles.includes(oldChild) && oldChild.dom) {
      // Clean up refs
      if (oldChild.vdom && oldChild.vdom.props.ref && 
          typeof oldChild.vdom.props.ref === 'object' && 
          'current' in oldChild.vdom.props.ref) {
        oldChild.vdom.props.ref.current = null;
      }
      
      operations.push({
        type: 'REMOVE',
        dom: oldChild.dom,
        parent: dom,
        oldTile: oldChild
      });
    }
  }
  
  // Also remove any keyed children that weren't reused
  oldKeyedChildren.forEach(child => {
    if (child.dom) {
      // Clean up refs
      if (child.vdom && child.vdom.props.ref && 
          typeof child.vdom.props.ref === 'object' && 
          'current' in child.vdom.props.ref) {
        child.vdom.props.ref.current = null;
      }
      
      operations.push({
        type: 'REMOVE',
        dom: child.dom,
        parent: dom,
        oldTile: child
      });
    }
  });
  
  tile.children = newChildTiles;
}

function dispatch(operations: PatchOperation[]) {
  operations.forEach(op => {
    switch (op.type) {
      case 'CREATE':
        if (op.dom && op.parent) {
          if (op.index !== undefined && op.index < op.parent.childNodes.length) {
            op.parent.insertBefore(op.dom, op.parent.childNodes[op.index]);
          } else {
            op.parent.appendChild(op.dom);
          }
        }
        break;
        
      case 'UPDATE':
        // Most updates are handled in updateProps
        break;
        
      case 'REMOVE':
        if (op.dom && op.parent) {
          if (op.parent.contains(op.dom)) {
            op.parent.removeChild(op.dom);
          }
        }
        break;
    }
  });
}

function requestCascadeForTile(tile: Tile) {
  if (!tile.vdom) return;
  
  // Schedule the update using requestAnimationFrame for browser optimization
  requestAnimationFrame(() => {
    const operations: PatchOperation[] = [];
    // Ensure vdom is not null before passing to updateTile
    const currentVdom = tile.vdom;
    if (currentVdom) {
      updateTile(tile, currentVdom, operations);
      dispatch(operations);
      
      runEffects();
    }
  });
}

connectCascade(requestCascadeForTile);
