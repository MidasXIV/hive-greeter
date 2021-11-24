import reduxDevTools from "@redux-devtools/cli";

export const devToolsOptions = {
  suppressConnectErrors: false,
  realtime: true,
  hostname: "localhost",
  port: 8000,
};

export const startDevtools = async (): Promise<void> => {
  if (!process.env.REDUX_DEVTOOLS_ENABLED) return Promise.resolve();
  return new Promise((resolve) => {
    reduxDevTools(devToolsOptions).then((devTools) =>
      devTools.on("ready", () => {
        resolve();
      })
    );
  });
};
