import { Character } from "../character/Character";
import { hasItemNameInInventory } from "../store/selectors";
import store from '../store'

export const decoratedName = (character: Character): string =>
  (hasItemNameInInventory(store.getState(), character, 'heavy crown') ? "👑 " : "") + character.name;
