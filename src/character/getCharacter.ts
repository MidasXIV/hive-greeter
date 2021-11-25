import { Character } from "./Character";
import { gameState } from "../gameState";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";

export const getCharacter = (id: string): Character | void => {
  purgeExpiredStatuses(id);
  return gameState.characters.get(id) ?? gameState.monsters.get(id);
};