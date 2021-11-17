import { Character } from "../character/Character";

export const hasCrown = (character: Character): boolean => {
  console.log(
    `${character.name} has a crown`,
    character.inventory.some((item) => item.name === "heavy crown"),
    character.inventory
  );
  return character.inventory.some((item) => item.name === "heavy crown");
};
