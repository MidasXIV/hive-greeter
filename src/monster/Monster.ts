import { Character } from "../character/Character";

export type Monster = Character & {
  isMonster: true;
};
