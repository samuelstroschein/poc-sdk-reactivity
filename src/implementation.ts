import { reatomResource } from "@reatom/async";
import { Ctx, atom } from "@reatom/core";

/**
 * Emulates a settings file on disk
 * with an atom to watch for changes
 */
const mockSettingsFile = atom(
  {
    sourceLanguageTag: "en",
    languageTags: ["en", "de"],
    modules: [],
  },
  "mockSettingsFile"
);

export const loadProject = async (ctx: Ctx) => {
  const settings = atom(await loadSettingsFile(ctx), "settings");

  // simulating fs.watch API
  mockSettingsFile.onChange((ctx, newSettings) => {
    settings(ctx, newSettings);
  });

  const modules = reatomResource(async (ctx) => {
    const modules = ctx.get(settings).modules;
    return await resolveModules({ modules });
  }, "modules");

  return {
    settings: async () => ctx.get(settings),
    installedModules: async () => modules,
    setSettings: async (newSettings: any) => {
      await saveSettingsFileToDisk(ctx, newSettings);
    },
  };
};

const simulateIO = async () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

const loadSettingsFile = async (ctx: Ctx) => {
  await simulateIO();
  return ctx.get(mockSettingsFile);
};

const saveSettingsFileToDisk = async (ctx: any, newSettings: any) => {
  // saving settings to disk...
  mockSettingsFile(ctx, newSettings);
  await simulateIO();
};

const resolveModules = async (args: { modules: string[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ in args.modules) {
    // emulate fetching modules
    await simulateIO();
  }
  return args.modules;
};
