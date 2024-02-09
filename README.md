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

### 1. Every property must be an async function

Even something subtle like `project.sourceLanguageTag` must be an async function https://github.com/opral/monorepo/issues/1680#issuecomment-1935226254.

The sourceLanguageTag of a project is derived from the project's settings. If computation a) a user changes the sourceLanguageTag of a project and computation via `setSourceLanguageTag()` and computation b) the app requests the name happen in parallel, computation a) must wait until computation b) is complete to yield the correct value.

```ts
// the initial source language tag is "en"

async function A() {
  await project.setSettings("sourceLanguageTag", "de");
  return await project.settings.sourceLanguageTag();
}

async function B() {
  return await project.settings.sourceLanguageTag()
}

// executing both in parallel
const results = await Promise.all([A(), B()]);

// inital: en
//
// expected output
// a: de
// b: de

// unexpected output
// a: de
// b: en
```
