---
title: "Modern Frontend State Management: Reactivity, Signals, and Sanity"
date: 2026-05-22
slug: react-vs-vanilla-js-performance-2026
---

# Modern Frontend State Management: Reactivity, Signals, and Sanity

If you've been working in frontend development for more than a few years, you've likely suffered from state management fatigue. We went from jQuery spaghetti, to Backbone models, to Angular two-way binding, to React's one-way data flow, to Redux boilerplate, to React Context, and now... Signals.

Why is managing state in a web application so profoundly difficult? It's because the UI is inherently a projection of state over time. When the state changes, the UI must update. The holy grail of frontend frameworks is finding the most efficient, developer-friendly way to ensure the DOM accurately reflects the underlying data structure without rebuilding the entire page on every keystroke.

In this deep dive, I want to explore the evolution of state management, focusing on the shift from React's top-down rendering model to the modern, fine-grained reactivity powered by Signals.

## The React Mental Model: Top-Down Reconciliation

React revolutionized UI development by introducing a simple mental model: `UI = f(state)`. You write a function that takes data and returns a description of the UI (JSX). When the state changes, React calls your function again, compares the new UI description with the old one (the Virtual DOM), and calculates the minimal set of DOM operations required to update the browser.

This is elegant, but it has a fundamental performance flaw. When state changes high up in the component tree, React re-renders every component below it by default.

```jsx
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <button onClick={() => setCount(c => c + 1)}>Clicks: {count}</button>
      <MassiveDataGrid />
    </div>
  );
}
```

In the example above, clicking the button changes the `count` state in `App`. React will re-render `App`, which means it will re-evaluate `Header` and `MassiveDataGrid`. If `MassiveDataGrid` takes 50ms to render, your button click feels sluggish, even though the grid doesn't care about the `count`.

We mitigate this with `React.memo`, `useMemo`, and `useCallback`. But this forces developers to manually manage the dependency graph of their application. It's a heavy mental burden, and it's notoriously easy to get wrong, leading to performance bottlenecks or stale closures.

## The Rise of Fine-Grained Reactivity (Signals)

Frameworks like SolidJS, Vue, and Preact have popularized a different approach: Signals.

A Signal is a wrapper around a value that can notify interested consumers when the value changes. It's essentially the Observer pattern baked into the primitive data type.

Instead of re-rendering a component tree, Signals track exactly which parts of the UI (or which computations) depend on them. When a Signal changes, the framework surgically updates only the DOM nodes or functions that explicitly subscribed to it.

```javascript
// A conceptual implementation of a Signal
import { signal, effect } from '@preact/signals';

const count = signal(0);

effect(() => {
  console.log(`The count is now ${count.value}`);
});

count.value++; // Triggers the effect automatically
```

Notice the lack of a dependency array. The `effect` function runs, accesses `count.value`, and the Signal system automatically registers that the effect depends on `count`. When `count` changes, the effect runs again.

### Why Signals Feel Like Magic

Let's look at how this changes the UI paradigm. In SolidJS (which heavily relies on Signals), components are not functions that re-run on every state change. They are factory functions that run exactly once to set up the DOM and the reactive bindings.

```jsx
import { createSignal } from "solid-js";

function App() {
  // This component function runs ONLY ONCE.
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <Header />
      <button onClick={() => setCount(c => c + 1)}>
        Clicks: {count()}
      </button>
      <MassiveDataGrid />
    </div>
  );
}
```

When `setCount` is called, SolidJS doesn't re-render `App`. It doesn't re-render `Header` or `MassiveDataGrid`. It goes directly to the text node inside the button and updates it. The performance is blisteringly fast, matching highly optimized vanilla JavaScript, without the developer having to write a single `useMemo`.

## Vanilla JS and Web Components

With the rise of Signals, a fascinating trend is emerging: using Signals outside of heavy frameworks. Libraries like `@preact/signals-core` or `usignal` allow you to bring fine-grained reactivity to Vanilla JS or Web Components.

You no longer need a massive Virtual DOM runtime to build dynamic interfaces. You can define your state with Signals and wire them directly to DOM elements. This results in incredibly lightweight applications that ship minimal JavaScript to the client.

*(Editor's note: Added deeper dive into building an actual app with vanilla signals to make this a true deep-dive article)*

## The "No Framework" Framework

Let's imagine building a complex UI component, like a shopping cart, without React, Vue, or Solid, just using Vanilla JS and a lightweight signals library. It sounds painful, but it's remarkably clean.

```javascript
import { signal, computed, effect } from '@preact/signals-core';

// 1. Define State
const cart = signal([]);

// 2. Derived State (Computed)
const totalItems = computed(() => cart.value.length);
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});

// 3. Actions
function addToCart(item) {
  cart.value = [...cart.value, item];
}

// 4. UI Bindings
const counterEl = document.getElementById('cart-counter');
const totalEl = document.getElementById('cart-total');

// Automatically updates the DOM when state changes
effect(() => {
  counterEl.textContent = totalItems.value;
});

effect(() => {
  totalEl.textContent = `$${totalPrice.value.toFixed(2)}`;
});

// Simulate user action
document.getElementById('buy-btn').addEventListener('click', () => {
  addToCart({ name: 'Mechanical Keyboard', price: 150 });
});
```

Look at how decoupled the business logic is from the UI rendering. The state (`cart`), derived state (`totalItems`, `totalPrice`), and actions (`addToCart`) are pure JavaScript. They can be tested independently of the DOM.

The `effect` blocks act as the bridge between your data model and the UI. When `addToCart` is called, it updates the `cart` signal. The `totalItems` and `totalPrice` computeds automatically re-evaluate. Finally, only the specific `effect` blocks that read those values run, updating exactly two text nodes in the DOM.

There is no Virtual DOM diffing. There is no reconciliation phase. It is O(1) DOM updates.

## Conclusion

React remains the industry titan, and for good reason—its ecosystem is unparalleled. However, the mental overhead of manually managing renders via `memo` and dependency arrays is significant.

Signals represent a shift towards letting the runtime do the heavy lifting of dependency tracking. They provide the developer experience of React (declarative UI) with the performance of Vanilla JS (surgical DOM updates). If you are starting a new project in 2026, I highly recommend evaluating tools built around fine-grained reactivity. It just might restore your sanity in frontend development.
