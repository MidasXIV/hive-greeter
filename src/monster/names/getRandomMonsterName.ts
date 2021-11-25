import { randomArrayElement } from "../randomArrayElement";
import { namesByKind } from "./namesByKind";

export type MonsterKind = "Goblin" | "Orc" | "Bandit";

export const monsterKinds: MonsterKind[] = ["Goblin", "Orc", "Bandit"];

export const getRandomMonsterName = (kind: MonsterKind) =>
  randomArrayElement(namesByKind.get(kind) ?? [kind]);
