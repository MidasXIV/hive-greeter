import { Monster } from "../monster/Monster";
import { Encounter } from "../monster/Encounter";
import { Character } from "../character/Character";
import { randomUUID } from "crypto";
import { setEncounter } from "./setEncounter";

export function createEncounter({
  monster,
  player,
}: {
  monster: Monster;
  player: Character;
}): Encounter {
  const encounter: Encounter = {
    characterId: player.id,
    monsterId: monster.id,
    date: new Date().toString(),
    id: randomUUID(),
    playerAttacks: [],
    monsterAttacks: [],
    rounds: 1,
    goldLooted: 0,
    outcome: "in progress",
  };
  setEncounter(encounter);
  return encounter;
}
