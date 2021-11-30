import { Character } from "./Character";

export const mentionCharacter = (character: Character): string =>
  character.isMonster ? character.name : `<@${character.id}>`;
