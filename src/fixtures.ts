import { MessageAttachment } from "discord.js";

export const DB_FILE = "./db.redux.json";

export const defaultProfile = "attachment://profile.png";
export const defaultProfileAttachment = new MessageAttachment(
  "./images/default-profile.png",
  "profile.png"
);