import { Character } from "./Character";
import { getCooldownRemaining } from "../gameState";

export const isCharacterOnCooldown = (
  characterId: string,
  type: keyof Character["cooldowns"]
): boolean => (getCooldownRemaining(characterId, type) ?? 0) > 0;
