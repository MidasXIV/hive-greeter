import { Character } from "../character/Character";

export const hasCrown = (character: Character): boolean =>
  character.inventory.some((item) => item.name === "heavy crown");
