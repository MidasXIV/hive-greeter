import { gameState } from "../gameState";
import { Character } from "./Character";

export const getUserCharacters = (): Character[] =>
  Array.from(gameState.characters.values()).filter(
    (character) => character.user
  );
