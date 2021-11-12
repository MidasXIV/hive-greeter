import { Character } from "./Character";

export const isCharacterOnCooldown = (
  characterId: string,
  type: keyof Character["cooldowns"]
): boolean => false;
