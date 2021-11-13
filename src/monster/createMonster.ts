import { randomUUID } from "crypto";
import { defaultCharacter } from "../character/defaultCharacter";
import { updateCharacter, updateMonster } from "../gameState";
import { Monster } from "./Monster";

export const createMonster = (
  monster: Partial<Monster> & { name: string }
): Monster => {
  const newMonster: Monster = {
    ...defaultCharacter,
    id: monster?.id ?? randomUUID(),
    ...monster,
    isMonster: true,
  };
  updateMonster(newMonster);
  console.log(`created monster ${newMonster.id}`);
  return newMonster;
};
