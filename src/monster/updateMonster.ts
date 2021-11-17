import { Monster } from "./Monster";
import { gameState } from "../gameState";

export const updateMonster = (monster: Monster): Monster => {
  console.log("update monster", monster);
  gameState.monsters.set(monster.id, monster);
  return gameState.monsters.get(monster.id) ?? monster;
};
