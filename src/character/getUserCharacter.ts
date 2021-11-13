import { User } from "discord.js";
import { Character } from "./Character";
import { createCharacter } from "./createCharacter";
import { gameState, defaultProfile } from "../gameState";
import { purgeExpiredStatuses } from "../purgeExpiredStatuses";

export const getUserCharacter = (user: User): Character => {
  purgeExpiredStatuses(user.id);
  const character = gameState.characters.get(user.id);
  if (!character) {
    return createCharacter({
      id: user.id,
      name: user.username,
      profile: user.avatarURL() || defaultProfile,
      user,
    });
  }
  return character;
};
