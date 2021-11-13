import { Character } from "../character/Character";
import { Encounter } from "./Encounter";

export type Monster = Character & {
  isMonster: true;
  encounters: Encounter[];
};
