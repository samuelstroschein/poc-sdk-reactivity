/**
 * Entrypoint to the state.
 */
export const loadProject = async () => {
  let settings = await loadSettingsFile()

  return {
    settings,
    setSettings: async (newSettings: any) => {
      settings = newSettings
    }
  };
};


const loadSettingsFile = async () => {
  return {
    modules: [
      "module-a@1.0.0",
      "module-b@2.32.1"
    ]
  }
}

const saveSettingsFile = async () => {}

const resolveModules = async (args: { settings: any }) => {
  const modules = []
  for (const uri in settings){
    // fetch fake link
    Promise.delay()

  }
};

const loadMessages = async () => {};

const saveMessages = async () => {};

const lintMessages = async () => {};

const getMessage = async () => {};

const updateMessage = async () => {};