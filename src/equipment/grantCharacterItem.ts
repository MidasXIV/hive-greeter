import store from "@adventure-bot/store";
import { Character } from "@adventure-bot/character/Character";
import { Item } from "@adventure-bot/equipment/equipment";
import { getCharacterById } from '@adventure-bot/store/selectors';
import { addItemToInventory } from "@adventure-bot/store/slices/characters";


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
