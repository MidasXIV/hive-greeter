import { Monster } from "../monster/Monster";
import { Encounter } from "../monster/Encounter";
import { Character } from "../character/Character";
import { updateMonster } from "../updateMonster";
import { randomUUID } from "crypto";
import { updateCharacter } from "../character/updateCharacter";

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
    inProgress: true,
  };
  updateMonster({
    ...monster,
    activeEncounters: monster.activeEncounters.set(encounter.id, true),
  });
  updateCharacter({
    ...player,
    activeEncounters: player.activeEncounters.set(encounter.id, true),
  });
  return encounter;
}
