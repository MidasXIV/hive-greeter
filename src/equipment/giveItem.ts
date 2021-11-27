import { updateCharacter } from "../character/updateCharacter";
import { Item } from "./Item";
import { Character } from "../character/Character";
import { grantCharacterItem } from "./grantCharacterItem";
import { removeItemIdFromCharacter } from "./removeItemIdFromCharacter";

export function giveItem({
  sender,
  recipient,
  item,
}: {
  sender: Character;
  recipient: Character;
  item: Item;
}): boolean {
  if (!item.id) {
    const error = `Tried to give an item without an ID`;
    console.error(error, item);
    return false;
  }
  // take from sender
  updateCharacter(
    removeItemIdFromCharacter({ character: sender, itemId: item.id })
  );
  // give to recipient
  updateCharacter(grantCharacterItem(recipient, item));
  return true;
}
