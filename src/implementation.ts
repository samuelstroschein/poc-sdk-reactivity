import { reatomResource } from "@reatom/async"

export const loadProject = async () => {
	const settings = reatomResource(async (ctx) => {
		// TODO: load settings file needs to re-trigger once the settings file changes
		return await ctx.schedule(() => loadSettingsFile())
	})

	const modules = reatomResource(async (ctx) => {
		const modules = (await ctx.spy(settings.promiseAtom)).modules 
		return await resolveModules({ modules })
	})

	return {
		name: async () => "test-project",
		settings: async () => settings,
		installedModules: async () => modules,
		setSettings: async (newSettings) => {
			await saveSettingsFile()
		},
	}
}

const simulateIO = async () => new Promise((resolve) => setTimeout(resolve, Math.random() * 100))

const loadSettingsFile = async () => {
	return {
		sourceLanguageTag: "en",
		languageTags: ["en", "de"],
		modules: [],
	}
}

const setSettings = async () => {
	await saveSettingsFile()
}

const saveSettingsFile = async () => {
	await simulateIO()
}

const resolveModules = async (args: { modules: string[] }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const _ in args.modules) {
		// emulate fetching modules
		await simulateIO()
	}
	return args.modules
}

const loadMessages = async () => {}

const saveMessages = async () => {}

const lintMessages = async () => {}

const getMessage = async () => {}

const updateMessage = async () => {}
