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
    date: new Date().toString(),
    id: randomUUID(),
  };
  updateMonster({
    ...monster,
    encounters: [...monster.encounters, encounter],
  });
  updateCharacter({
    ...player,
    encounters: [...monster.encounters, encounter],
  });
  return encounter;
}
