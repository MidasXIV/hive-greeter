import { User } from "discord.js";
import { Character } from "./Character";
import { createCharacter } from "./createCharacter";
import { defaultProfile } from "../gameState";

import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";

import store from "@adventure-bot/store";
import { getCharacterById } from "@adventure-bot/store/selectors";

export const getUserCharacter = (user: User): Character => {
  purgeExpiredStatuses(user.id);
  const character = getCharacterById(store.getState(), user.id);
  if (!character) {
    return createCharacter({
      id: user.id,
      name: user.username,
      profile: user.avatarURL() || defaultProfile,
    });
  }
  return character;
};
