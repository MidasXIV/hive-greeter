import { Character } from "./Character";
import { gameState } from "../gameState";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Monster } from "../monster/Monster";

export const getCharacterUpdate = (character: Character): Character => {
  purgeExpiredStatuses(character.id);
  return gameState.characters.get(character.id) ?? character;
};
export const getMonsterUpdate = (monster: Monster): Monster => {
  purgeExpiredStatuses(monster.id);
  return gameState.monsters.get(monster.id) ?? monster;
};
