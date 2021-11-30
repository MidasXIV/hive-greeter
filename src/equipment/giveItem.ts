import { updateCharacter } from "../character/updateCharacter";
import { Character } from "../character/Character";
import { grantCharacterItem } from "./grantCharacterItem";
import { removeItemIdFromCharacter } from "./removeItemIdFromCharacter";
import { Tradeable } from "./equipment";

export function giveItem({
  sender,
  recipient,
  item,
}: {
  sender: Character;
  recipient: Character;
  item: Tradeable;
}): boolean {
  if (!item.id) {
    const error = `Tried to give an item without an ID`;
    console.error(error, item);
    return false;
  }
  if (sender.id === recipient.id) return true;
  // take from sender
  updateCharacter(
    removeItemIdFromCharacter({ character: sender, itemId: item.id })
  );
  // give to recipient
  updateCharacter(grantCharacterItem(recipient, item));
  return true;
}