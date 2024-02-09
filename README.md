# POC reactive state requirements of the SDK

https://www.loom.com/share/02ed80cbff644b47b454c14c7ec51587?sid=af0d7678-68df-407d-81a0-79740bb9e807

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

## Example case

Even something subtle like `project.sourceLanguageTag` must be an async function https://github.com/opral/monorepo/issues/1680#issuecomment-1935226254.

The sourceLanguageTag of a project is derived from the project's settings. If computation a) a user changes the sourceLanguageTag of a project and computation via `setSourceLanguageTag()` and computation b) the app requests the name happen in parallel, computation a) must wait until computation b) is complete to yield the correct value.

```ts
// the initial source language tag is "en"

async function A() {
  await project.setSettings("sourceLanguageTag", "de");
  return await project.settings.sourceLanguageTag();
}

async function B() {
  return await project.settings.sourceLanguageTag();
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
