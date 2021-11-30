import fs from "fs";
import { updateLastSave } from "./store/slices/game";
import store, { ReduxState } from "./store";
import { DB_FILE } from "./fixtures";

export const saveDB = (file = DB_FILE): ReduxState => {
  console.time("saveDB");
  store.dispatch(updateLastSave());
  const state = store.getState();
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
  console.timeEnd("saveDB");
  return state;
};
