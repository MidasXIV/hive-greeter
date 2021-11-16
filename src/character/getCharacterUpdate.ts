import { Character } from "./Character";
import { gameState } from "../gameState";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";

export const getCharacterUpdate = (character: Character): Character => {
  purgeExpiredStatuses(character.id);
  if (!gameState.characters.get(character.id)) {
    console.log(
      `could not get ${character.id} ${character.name} from gameState.characters`
    );
  }
  return gameState.characters.get(character.id) ?? character;
};
