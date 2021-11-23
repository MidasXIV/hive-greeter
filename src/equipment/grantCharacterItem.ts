import store from "../store";
import { Character } from "../character/Character";
import { Item } from "../equipment/equipment";
import { getCharacterById } from '../store/selectors';
import { addItemToInventory } from "../store/slices/characters";


export const grantCharacterItem = (
  character: Character,
  item: Item
): Character => {
  store.dispatch(addItemToInventory({
    character,
    item,
  }))
  return getCharacterById(store.getState(), character.id)
};
