import { Character } from "./Character";
import { purgeExpiredStatuses, gameState } from "../gameState";

export const getCharacterUpdate = (character: Character): Character => {
  purgeExpiredStatuses(character.id);
  return gameState.characters.get(character.id) ?? character;
};
