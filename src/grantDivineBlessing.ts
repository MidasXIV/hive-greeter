import { getCharacter } from "./character/getCharacter";
import store from "./store"
import { grantDivineBlessing as doGrantDivineBlessing } from "./store/slices/characters";

export const grantDivineBlessing = (characterId: string): void => {
  const character = getCharacter(characterId);
  if (!character) return;
  store.dispatch(doGrantDivineBlessing(character))
};
