import { Character } from "../character/Character";

export type Monster = Character & {
  isMonster: true;
};

export type NewMonster = Omit<Partial<Monster>, "id"> & { name: string };

export const isMonster = (character: Character): character is Monster =>
  character.isMonster ?? false;
