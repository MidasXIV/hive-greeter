import { Character } from "@adventure-bot/character/Character";
import { hasItemNameInInventory } from "@adventure-bot/store/selectors";
import store from '@adventure-bot/store'

export const decoratedName = (character: Character): string =>
  (hasItemNameInInventory(store.getState(), character, 'heavy crown') ? "👑 " : "") + character.name;
