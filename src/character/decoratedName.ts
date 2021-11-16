import { Character } from "./Character";
import { hasCrown } from "../heavyCrown/hasCrown";

export const decoratedName = (character: Character): string =>
  hasCrown(character) ? "👑 " : "" + character.name;
