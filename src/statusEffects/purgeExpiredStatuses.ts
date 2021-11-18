import store from '@adventure-bot/store'
import { purgeExpiredStatuses as doPurgeExpiredStatuses } from '@adventure-bot/store/slices/characters'
import { gameState } from "@adventure-bot/gameState";

export const purgeExpiredStatuses = (characterId: string): void => {
  const character = gameState.characters.get(characterId);
  if (!character) return;
  store.dispatch(doPurgeExpiredStatuses(character))
  console.log(`${characterId} status effects purged`);
};
