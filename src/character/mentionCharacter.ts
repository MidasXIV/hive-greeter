import { Character } from "./Character";

export const mentionCharacter = (character: Character): string =>
  character.user?.id ? `<@${character.user.id}>` : character.name;
