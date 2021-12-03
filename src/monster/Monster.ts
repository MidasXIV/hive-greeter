import { Character } from "../character/Character";

export type Monster = Character & {
  isMonster: true;
};

export const isMonster = (character: Character): character is Monster =>
  character.isMonster ?? false;
