import { Character } from "./character/Character";
import { cooldowns } from "./character/updateCharacter";
import { gameState } from "./gameState";

export const getCooldownRemaining = (
  characterId: string,
  type: keyof Character["cooldowns"]
): number => {
  try {
    const cooldown = cooldowns[type] ?? 5 * 60000;
    const lastUsed = gameState.characters.get(characterId)?.cooldowns[type];
    if (!lastUsed) return 0;
    const remaining = new Date(lastUsed).valueOf() + cooldown - Date.now();
    if (remaining < 0) return 0;
    return remaining;
  } catch (e) {
    console.error(`failed to getCooldownRemaining for user ${characterId}`);
    return 0;
  }
};
