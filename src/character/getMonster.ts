import { purgeExpiredStatuses, gameState } from "../gameState";
import { Monster } from "../monster/Monster";

export const getMonster = (id: string): Monster | void => {
  purgeExpiredStatuses(id);
  return gameState.monsters.get(id);
};
