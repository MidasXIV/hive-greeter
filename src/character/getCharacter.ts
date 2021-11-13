import { Character } from "./Character";
import { purgeExpiredStatuses, gameState } from "../gameState";

export const getCharacter = (id: string): Character | void => {
  purgeExpiredStatuses(id);
  return gameState.characters.get(id);
};
