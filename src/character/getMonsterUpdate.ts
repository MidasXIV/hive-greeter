import { purgeExpiredStatuses, gameState } from "../gameState";
import { Monster } from "../monster/Monster";

export const getMonsterUpate = (monster: Monster): Monster => {
  purgeExpiredStatuses(monster.id);
  return gameState.monsters.get(monster.id) ?? monster;
};
