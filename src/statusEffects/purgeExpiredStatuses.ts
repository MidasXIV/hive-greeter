import store from '@adventure-bot/store'
import { purgeExpiredStatuses as doPurgeExpiredStatuses } from '@adventure-bot/store/slices/characters'
import { getCharacterById } from '@adventure-bot/store/selectors';

export const purgeExpiredStatuses = (characterId: string): void => {
  const character = getCharacterById(store.getState(), characterId);
  if (!character) return;
  store.dispatch(doPurgeExpiredStatuses(character))
  console.log(`${characterId} status effects purged`);
};
