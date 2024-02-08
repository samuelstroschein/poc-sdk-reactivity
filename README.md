# POC reactive state requirements of the SDK

## Objectives

1. Model async derived computations that resemble the inlang SDK to retrieve requirements.
2. Explore whether reactive programming within the SDK is of substantial benefit to justify its adoption.

## Background

The inlang SDK uses signals, a reactive programming pattern, to describe dependencies between state.

```ts
// pseudocode

async function loadProject() {

  // settings is reactive
  const settings = signal(await loadSettings())

  // modules are derived from settings. if settings changes,
  // the value of modules needs to update and reflect changes of settings
  const modules = derived(loadModules(settings())
}
```

The team faced multiple challenges with signals which led to https://github.com/opral/monorepo/issues/1772. During those discussions, the remark that reactive programming within the SDK might not be required came up.

## Findings

### 1. Expressing the simplest form of state already requires reactivity

```ts


```