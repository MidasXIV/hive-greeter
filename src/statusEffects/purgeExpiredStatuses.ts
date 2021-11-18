
import store from '@adventure-bot/store'
import { purgeExpiredStatuses as doPurgeExpiredStatuses } from './store/slices/characters'
import { getCharacterById } from 'store/selectors';

export const purgeExpiredStatuses = (characterId: string): void => {
  const character = getCharacterById(store.getState(), characterId);
  if (!character) return;
  store.dispatch(doPurgeExpiredStatuses(character))
  console.log(`${characterId} status effects purged`);
};
