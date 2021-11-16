import { gameState } from "../gameState";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Monster } from "../monster/Monster";

export const getMonsterUpate = (monster: Monster): Monster => {
  purgeExpiredStatuses(monster.id);
  if (!gameState.monsters.get(monster.id)) {
    console.warn(`getMonsterUpate: unable to read monster id ${monster.id}`);
  }
  return gameState.monsters.get(monster.id) ?? monster;
};
