import { Monster } from "../monster/Monster";
import { Encounter } from "../monster/Encounter";
import { Character } from "../character/Character";
import { updateMonster } from "../updateMonster";
import { randomUUID } from "crypto";
import { updateCharacter } from "../character/updateCharacter";
import { getCharacterUpdate } from "../character/getCharacterUpdate";
import { getMonsterUpate } from "../character/getMonsterUpdate";
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
    outcome: "in progress",
  };
  updateMonster({
    ...getMonsterUpate(monster),
    activeEncounters: monster.activeEncounters.concat(encounter.id),
  });
  updateCharacter({
    ...getCharacterUpdate(player),
    activeEncounters: player.activeEncounters.concat(encounter.id),
  });
  setEncounter(encounter);
  return encounter;
}
