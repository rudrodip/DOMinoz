# DOMinoz

DOMinoz is a minimal DOM reconciliation engine that brings the familiar Component/Element model from React to a simpler, synchronous "dominoz cascade" architecture. DOMinoz provides a predictable, explicit update mechanism with no hidden schedulers or batching systems.

## Core Architecture

DOMinoz consists of three primary subsystems working together:

1. **VDOM Model** - Defines the virtual DOM structure
2. **Cascade System** - Handles diffing and reconciliation
3. **Hook System** - Manages component state and lifecycle

Each of these subsystems works in a straight-forward, synchronous manner to produce a predictable rendering pipeline.

## VDOM Model

The virtual DOM in DOMinoz is built around simple JavaScript objects that represent DOM nodes and component instances.

### VNode Interface

```typescript
interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string)[];
  key?: string | number;
}
```

- **type**: Either a string HTML tag (e.g., 'div') or a component function
- **props**: Object containing attributes, event listeners, and other properties
- **children**: Array of child VNodes or string text nodes
- **key**: Optional identifier for reconciliation (similar to React keys)

### Element Creation

The `createElement` function creates a virtual node (VNode):

```typescript
createElement(
  type: string | ComponentFunction,
  props: Record<string, any> = {},
  ...children: (VNode | string | null | undefined | boolean | number | any[])[]
): VNode
```

This accepts similar arguments to React's createElement, flattening nested arrays and filtering out null, undefined, and boolean false values.

## Tile Architecture

The core internal representation in DOMinoz is the **Tile**, which tracks the rendering context of a component:

```typescript
interface Tile {
  type: Function;
  props: Record<string, any>;
  dom: HTMLElement | Text | null;
  parent: Tile | null;
  children: Tile[];
  hooks: Hook[];
  hookIndex: number;
  vdom: VNode | null;
}
```

Each Tile represents:

- A component instance with its props
- A reference to its parent and child Tiles
- The associated real DOM node
- The hooks used by the component
- The current hook index (used during rendering)
- A reference to its virtual DOM representation

Unlike React's Fiber system, Tiles don't include work prioritization or scheduling - they're purely for tracking component structure and state.

## Cascade System

The "Cascade" is DOMinoz's synchronous reconciliation process. When a state change occurs, it triggers a cascade of updates through the component tree.

### Rendering Process

1. **Initial Render**:
   - Creates the initial Tile structure
   - Recursively creates DOM nodes
   - Attaches event handlers and props
   - Mounts to container

2. **Updates**:
   - Compares new VNode with old VNode
   - Generates patch operations
   - Applies patches to the DOM
   - Runs effect hooks

### Patch Operations

DOMinoz uses three types of patch operations:

```typescript
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
```

These operations are collected during the diffing phase and then applied to the DOM in one synchronous pass.

### Reconciliation Algorithm

DOMinoz's reconciliation algorithm:

1. Compares node types - if different, replace entirely
2. For string types (HTML elements):
   - Updates props and attributes
   - Reconciles children using keys for identity
3. For function types (components):
   - Calls the function with new props
   - Recursively updates component tree

### Keyed Children

DOMinoz supports keyed children for efficient updates:

1. Creates a map of old children with keys
2. For each new child:
   - Checks if a keyed match exists
   - Reuses and updates the matched child
   - Creates new Tiles for unmatched children
3. Removes old children that weren't reused

## Hook System

DOMinoz provides a hook system similar to React hooks, but with a synchronous execution model:

### Hook Interface

```typescript
interface Hook {
  type: string;
}
```

With specialized implementations for different hook types:

```typescript
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
```

### Available Hooks

1. **useSignal**:

   ```typescript
   function useSignal<T>(initialValue: T): [T, (newValue: T) => void]
   ```

   - Creates local component state
   - Returns [value, setValue] pair
   - Calling setValue triggers a synchronous re-render
   - Performs basic equality checks to prevent unnecessary updates

2. **useAfter**:

   ```typescript
   function useAfter(effect: () => void | (() => void), deps?: any[])
   ```

   - Runs side effects after DOM updates
   - Similar to React's useEffect but runs synchronously after dispatch
   - Accepts optional dependencies array for conditional execution
   - Supports cleanup functions for resource management

3. **useAnchor**:

   ```typescript
   function useAnchor<T = any>(initialValue: T = null as unknown as T)
   ```

   - Creates a mutable reference that persists across renders
   - Similar to React's useRef
   - Useful for DOM node references or mutable variables

### Hook Execution Model

1. During component render, each hook call increments the `hookIndex`
2. Hooks are stored in the component's Tile for persistence across renders
3. First render: initializes hooks
4. Subsequent renders: retrieves existing hooks by index
5. After renders: effects execute in insertion order

## Rendering Pipeline

The complete rendering pipeline in DOMinoz:

1. **Initial Render**:
   - `render(vnode, container)` is called
   - Root Tile is created
   - Component tree is recursively rendered
   - DOM nodes are created and appended to container
   - After effects are executed

2. **Update Cycle**:
   - State change via `setValue` from useSignal
   - Request cascade for affected Tile
   - Component function re-executes with same hook calls
   - VDOM tree is diffed against previous version
   - Patch operations are collected
   - DOM is updated synchronously
   - After effects are executed

## Implementation Details

### DOM Updates

DOMinoz handles DOM updates efficiently by:

1. Only updating changed attributes and properties
2. Special handling for event listeners with proper cleanup
3. Special case for style objects, converting to inline styles
4. Handling boolean attributes correctly
5. Proper text node handling

### Event Handling

Event handlers are attached directly to DOM nodes using native event listeners:

```typescript
if (key.startsWith('on')) {
  const eventName = key.slice(2).toLowerCase();
  
  if (oldProps[key]) {
    dom.removeEventListener(eventName, oldProps[key]);
  }
  
  dom.addEventListener(eventName, newProps[key]);
}
```

### Ref Handling

Refs are supported in a React-like manner:

```typescript
// Handle refs
if (newProps.ref && typeof newProps.ref === 'object' && 'current' in newProps.ref) {
  newProps.ref.current = dom;
}
```

## Example Component

```typescript
function Counter() {
  const [count, setCount] = useSignal(0);
  
  useAfter(() => {
    console.log(`Count changed to ${count}`);
    return () => console.log('Cleanup before next effect');
  });
  
  const buttonRef = useAnchor();
  
  useAfter(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  });
  
  return createElement(
    'div',
    {},
    createElement('h2', {}, `Count: ${count}`),
    createElement(
      'button',
      { 
        onclick: () => setCount(count + 1),
        ref: buttonRef
      },
      'Increment'
    )
  );
}
```

## Differences from React

DOMinoz differs from React in several key ways:

1. **Synchronous Updates**: No batching or scheduling - updates cascade immediately
2. **No Fiber Architecture**: No work prioritization or concurrent mode
3. **No Suspense/Error Boundaries**: Simpler component model without advanced features
4. **No JSX Processing**: Uses createElement directly (though JSX could be supported)
5. **No Diffing Optimizations**: Simpler reconciliation without heuristics
6. **Direct DOM Manipulation**: Updates DOM synchronously in the same tick
7. **Simpler Mental Model**: "Dominoz cascade" architecture is more predictable

## Performance Considerations

DOMinoz's architecture prioritizes simplicity and predictability over optimized performance:

1. **Immediate Execution**: Updates happen synchronously, which may block the main thread for large trees
2. **No Batching**: Each state update triggers a complete render cycle
3. **No Scheduling**: All work is done at equal priority
4. **No Memoization**: No built-in memoization strategies (like React.memo or useMemo)

## API Reference

### Core API

```typescript
// Create a virtual DOM node
createElement(type, props, ...children): VNode

// Render a virtual DOM tree to a container
render(vnode: VNode, container: HTMLElement): void
```

### Hooks API

```typescript
// Local state management
useSignal<T>(initialValue: T): [T, (newValue: T) => void]

// Side effects after DOM updates
useAfter(effect: () => void | (() => void), deps?: any[]): void

// Mutable reference
useAnchor<T = any>(initialValue: T = null): { current: T }
```

## Internal API Reference

```typitten
// Internal tile interface
interface Tile {
  type: Function;
  props: Record<string, any>;
  dom: HTMLElement | Text | null;
  parent: Tile | null;
  children: Tile[];
  hooks: Hook[];
  hookIndex: number;
  vdom: VNode | null;
}

// Patch operations
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
```

---

DOMinoz is designed to be a lightweight, educational implementation of a React-like library that prioritizes simplicity and predictability. Its explicit update model makes it easier to reason about than more complex frameworks, while still providing the familiar Component/Element model that developers enjoy.

---

## Philosophy & Goals

DOMinoz is built around three key principles:

1. **Explicit, predictable updates**: No hidden schedulers or asynchronous batching. Each state change immediately triggers a "cascade" of diffs and patches.
2. **Familiar surface**: Keep `Component` and `Element` nomenclature from React. Introduce minimal new terms for the engine internals.
3. **Dominoz cascade**: Every component update is like knocking over a domino—the change propagates in a controlled chain, ensuring only affected DOM nodes are updated.

---

## Getting Started

### Quick Start

Create an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DOMinoz App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="dist/index.js"></script>
</body>
</html>
```

Write your app in `src/app.ts`:

```ts
import { createElement, render, useSignal, useAfter } from 'dominoz';

function App() {
  const [count, setCount] = useSignal(0);
  useAfter(() => console.log('Count is now', count));

  return createElement(
    'div',
    {},
    createElement('h1', {}, `Counter: ${count}`),
    createElement(
      'button',
      { onclick: () => setCount(count + 1) },
      'Increment'
    ),
    createElement(
      'button',
      { onclick: () => setCount(count - 1), style: { marginLeft: '8px' } },
      'Decrement'
    )
  );
}

const root = document.getElementById('root');
if (root) render(createElement(App, {}), root);
```

Bundle with your favorite tool (use `bun` its pretty cool) and open `index.html` — you're live!

---

## Core Concepts

### VDOM & Elements

- **Element**: A plain JS object describing a DOM tag or component.
- `createElement(type, props, ...children)` builds a `VNode` with:
  - `type`: string tag or Function Component
  - `props`: attributes, event handlers, styles
  - `children`: text or nested VDOM

### Tiles & the Cascade

- **Tile**: The minimal internal unit tracking a component's render context (analogous to React's Fiber, but far simpler).
- **Cascade**: The synchronous diff phase. On state change, DOMinoz re-renders only the affected component subtree into a new VDOM and **compares** it with the previous VDOM.

### Dispatch Phase

- **Dispatch**: Apply a list of patch operations (`CREATE`, `UPDATE`, `REMOVE`) directly to the real DOM.
- After dispatch finishes, any queued `useAfter` effects run in insertion order.

---

## Detailed Examples

### Counter Component

```ts
function Counter() {
  const [count, setCount] = useSignal(0);
  useAfter(() => console.log('Rendered count:', count));

  return createElement(
    'div', {},
    createElement('h2', {}, `Count: ${count}`),
    createElement(
      'button',
      { onclick: () => setCount(count + 1) },
      '+'
    ),
    createElement(
      'button',
      { onclick: () => setCount(count - 1), style: { marginLeft: '6px' } },
      '-'
    )
  );
}
```

### Todo List

```ts
function TodoApp() {
  const [items, setItems] = useSignal<string[]>([]);
  const [input, setInput] = useSignal('');

  function addItem() {
    if (input.trim()) {
      setItems([...items, input.trim()]);
      setInput('');
    }
  }

  return createElement(
    'div', {},
    createElement('h3', {}, 'My Todo List'),
    createElement(
      'input',
      {
        value: input,
        oninput: (e: any) => setInput(e.currentTarget.value),
        placeholder: 'New item…'
      }
    ),
    createElement(
      'button',
      { onclick: addItem },
      'Add'
    ),
    createElement(
      'ul', {},
      ...items.map((item, idx) => createElement('li', { key: idx }, item))
    )
  );
}
```

### Form Handling

```ts
function LoginForm() {
  const [email, setEmail] = useSignal('');
  const [pass, setPass] = useSignal('');
  const [submitted, setSubmitted] = useSignal(false);

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ email, pass });
    setSubmitted(true);
  }

  return createElement(
    'form', { onsubmit: handleSubmit },
    createElement('input', { type: 'email', value: email, oninput: e => setEmail(e.currentTarget.value) }),
    createElement('input', { type: 'password', value: pass, oninput: e => setPass(e.currentTarget.value) }),
    createElement('button', { type: 'submit' }, 'Log In'),
    submitted && createElement('p', {}, 'Logged in! 🎉')
  );
}
```

### Custom Hook Example

```ts
function useToggle(initial: boolean) {
  const [state, setState] = useSignal(initial);
  function toggle() {
    setState(!state);
  }
  return [state, toggle] as const;
}

function ToggleDemo() {
  const [on, toggle] = useToggle(false);
  return createElement(
    'div', {},
    createElement('p', {}, `Switch is ${on ? 'ON' : 'OFF'}`),
    createElement('button', { onclick: toggle }, 'Toggle')
  );
}
```

---

## Project Structure

```text
├── dist/            # Bundled output
├── src/
│   ├── index.ts       # Exports top-level API (render, createElement, hooks)
│   ├── vdom.ts      # VNode types & createElement implementation
│   ├── cascade.ts  # Cascade (compare) & Dispatch logic
│   └── hooks.ts     # useSignal, useAfter, useAnchor internals
├── package.json
├── tsconfig.json
└── README.md        # ← You're reading it!
```

---

## Terminology Mapping

| React Term      | DOMinoz Term   | Description                                   |
| --------------- | ------------- | --------------------------------------------- |
| Fiber           | Tile          | Minimal unit tracking render context         |
| Reconciler      | Cascade       | Synchronous diff phase                        |
| Diff            | Compare       | VDOM tree comparison                          |
| Commit Phase    | Dispatch      | Apply patches to real DOM                     |
| Scheduler       | —             | No scheduler—everything is immediate          |

---
