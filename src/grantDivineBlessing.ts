import { getCharacter } from "./character/getCharacter";
import { updateCharacter } from "./character/updateCharacter";

export const grantDivineBlessing = (characterId: string): void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    maxHP: character.maxHP + 1,
    hp: character.hp + 1,
  });
};
