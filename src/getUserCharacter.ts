import { User } from "discord.js";
import { Character } from "./character/Character";
import { createCharacter } from "./character/createCharacter";
import { purgeExpiredStatuses, gameState, defaultProfile } from "./gameState";

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
