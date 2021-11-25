import { banditNames } from "./bandit";
import { MonsterKind } from "./getRandomMonsterName";
import { goblinNames } from "./goblin";
import { orcNames } from "./orc";

export const namesByKind = new Map<MonsterKind, string[]>([
  ["Goblin", goblinNames],
  ["Orc", orcNames],
  ["Bandit", banditNames],
]);
