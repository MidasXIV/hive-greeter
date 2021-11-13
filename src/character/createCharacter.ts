import { randomUUID } from "crypto";
import { Character } from "./Character";
import { defaultCharacter } from "./defaultCharacter";
import { updateCharacter } from "../updateCharacter";

export const createCharacter = (
  character: Partial<Character> & { name: string }
): Character => {
  const newCharacter: Character = {
    ...defaultCharacter,
    id: character?.id ?? randomUUID(),
    ...character,
  };
  updateCharacter(newCharacter);
  console.log(`created ${newCharacter.id}`);
  return newCharacter;
};
