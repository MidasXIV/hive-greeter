import { gameState } from "../gameState";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Monster } from "../monster/Monster";

export const getMonster = (id: string): Monster | void => {
  purgeExpiredStatuses(id);
  return gameState.monsters.get(id);
};
