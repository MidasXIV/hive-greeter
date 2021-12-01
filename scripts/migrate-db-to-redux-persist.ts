import fs from "fs";
import path from "path";

const migrate = async () => {
  const reduxDBPath = path.join(__dirname, "..", "db.redux.json");
  const persistedReduxDBPath = path.join(
    __dirname,
    "..",
    "db",
    "persist.root.json"
  );

  if (fs.existsSync(reduxDBPath)) {
    const reduxDBData = JSON.parse(
      fs.readFileSync(reduxDBPath).toString("utf-8")
    );

    const persistedReduxDB = {
      ...Object.keys(reduxDBData).reduce(
        (acc, k) => ({
          ...acc,
          [k]: JSON.stringify(reduxDBData[k]),
        }),
        {} as Record<string, string>
      ),
      _persist: `{"version":0,"rehydrated":true}`,
    };

    fs.writeFileSync(
      persistedReduxDBPath,
      JSON.stringify(persistedReduxDB, null, 2)
    );
  }
};

migrate();
