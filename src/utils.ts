import { Character } from "./db";

export const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const mentionCharacter = (character: Character): string =>
  character.user?.id ? `<@${character.user.id}>` : character.name;
