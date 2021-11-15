import { gameState } from "../gameState";
import { Monster } from "./Monster";

export function getRoamingMonsters(): Monster[] {
  return Array.from(gameState.monsters.values()).filter((monster) => {
    return monster.hp > 0;
  });
}
