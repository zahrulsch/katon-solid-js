---
lastUpdated: true
---

# Getting Started

In this section, you’ll learn how to install `Katon SolidJS` and begin using its hooks and components in your [`SolidJS`](https://www.solidjs.com/) application.

## Adding Katon to Your Project

::: code-group

```sh [npm]
npm install katon-solid-js
```

```sh [yarn]
yarn add katon-solid-js
```

```sh [pnpm]
pnpm add katon-solid-js
```

:::

It is recommended to install a copy of `katon-solid-js` in your `package.json`, using one of the methods mentioned above.

## Hook Usage Example

As an example, we will write one of the hooks: [`createBreakpoint`](./), which returns the currently active breakpoint.

::: code-group
<<<./snippets/create-breakpoint.tsx#snippet [default.tsx]
<<<./snippets/create-breakpoint.tsx#snippetBulma [with-specific.tsx]
<<<./snippets/create-breakpoint.tsx#snippetCustom [custom.tsx]
:::

## Component Usage Example

As an example, we will write one of the components: [`AnimatePresence`](./), which runs transitions or animations when the `show` prop changes.

::: code-group
<<<./snippets/animate-presence.tsx#snippet [string-class.tsx]
<<<./snippets/animate-presence.tsx#snippet0 [object-class.tsx]
:::

::: info
When the component is rendered, a `data-show` attribute will automatically be added to the HTML element, and `data-closed` will be applied when it begins to unmount.
:::
::: info
The unmounting process will wait for any `transition` or `animation` to finish if present.
:::
