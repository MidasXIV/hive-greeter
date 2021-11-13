import { Character } from "./Character";
import { gameState } from "../gameState";
import { purgeExpiredStatuses } from "../purgeExpiredStatuses";

export const getCharacterUpdate = (character: Character): Character => {
  purgeExpiredStatuses(character.id);
  return gameState.characters.get(character.id) ?? character;
};
