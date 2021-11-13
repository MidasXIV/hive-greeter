import { gameState } from "../gameState";
import { Monster } from "../monster/Monster";

export const getMonsters = (): Map<string, Monster> => gameState.monsters;
