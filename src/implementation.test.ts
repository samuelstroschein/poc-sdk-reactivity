import { test, expect } from "vitest";
import { loadProject } from "./implementation.js";



test("if settings are set and read in parallel, the read value should be derived from the newly set value to avoid stale sate", async ()=> {
    const project = await loadProject()

    const settings = await project.settings()
    expect(settings.sourceLanguageTag).toBe("en")

    const computations = await Promise.all([
        // computation [0] sets settings.sourceLanguageTag to "de"
        // in parallel to computation [1] getting the settings
        (async () => {
            const copiedSettings = structuredClone(settings)
            copiedSettings.sourceLanguageTag = "de"
            await project.setSettings(copiedSettings)
            return project.settings()
        })(),
        // computation [1] depends on computation [0] and must not resolve
        // until computation [0] is complete to return the latest state
        project.settings()
    ])

    // both computations are expected to compute in the same "tick" 
    // and yield "de" as a result. 
    expect(computations[0].sourceLanguageTag).toBe("de")
    expect(computations[1].sourceLanguageTag).toBe("de")
})