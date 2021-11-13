import { Monster } from "./monster/Monster";
import { gameState } from "./gameState";

export const updateMonster = (character: Monster | void): Monster | void => {
  if (!character) return;
  gameState.monsters.set(character.id, character);
  return gameState.monsters.get(character.id);
};
