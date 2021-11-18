import { Character } from "./character/Character";
import store from '@adventure-bot/store'
import { getCooldownByType, getCharacterById } from "@adventure-bot/store/selectors";

export const getCooldownRemaining = (
  characterId: string,
  type: keyof Character["cooldowns"]
): number => {
  const state = store.getState()
  try {
    const cooldown = getCooldownByType(state, type) ?? 5 * 60000;
    const lastUsed = getCharacterById(state, characterId)?.cooldowns[type];
    if (!lastUsed) return 0;
    const remaining = new Date(lastUsed).valueOf() + cooldown - Date.now();
    if (remaining < 0) return 0;
    return remaining;
  } catch (e) {
    console.error(`failed to getCooldownRemaining for user ${characterId}`, e);
    return 0;
  }
};
