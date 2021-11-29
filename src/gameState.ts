import { MessageAttachment } from "discord.js";
import fs from 'fs'
import { updateLastSave } from "./store/slices/game";
import store from "./store";
// import { keys } from "remeda";

export const DB_FILE = "./db.redux.json";

export const defaultProfile = "attachment://profile.png";
export const defaultProfileAttachment = new MessageAttachment(
  "./images/default-profile.png",
  "profile.png"
);

export const saveDB = (file = DB_FILE) => {
  console.time("saveDB");
  store.dispatch(updateLastSave())
  const state = store.getState();
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
  console.timeEnd("saveDB");
  return state
};

export const d20 = (): number => Math.ceil(Math.random() * 20);
export const d6 = (): number => Math.ceil(Math.random() * 6);
