import { Character } from "./Character";
import { getCooldownRemaining } from "../getCooldownRemaining";

export const isCharacterOnCooldown = (
  characterId: string,
  type: keyof Character["cooldowns"]
): boolean =>
  process.env.COOLDOWNS_DISABLED === "true"
    ? false
    : (getCooldownRemaining(characterId, type) ?? 0) > 0;
