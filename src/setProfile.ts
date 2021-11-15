import { Character } from "./character/Character";
import { getCharacter } from "./character/getCharacter";
import { updateCharacter } from "./character/updateCharacter";

export const setProfile = (id: string, url: string): Character | void => {
  const character = getCharacter(id);
  if (!character) return;
  updateCharacter({ ...character, profile: url });
  return character;
};
