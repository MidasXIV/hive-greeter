import { Character } from "./Character";
import { getCharacter } from "./getCharacter";
import { updateCharacter } from "./updateCharacter";

export const setProfile = (id: string, url: string): Character | void => {
  const character = getCharacter(id);
  if (!character) return;
  updateCharacter({ ...character, profile: url });
  return character;
};
