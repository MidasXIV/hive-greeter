import { Encounter } from "../../monster/Encounter";
import { Character } from "../../character/Character";
import { getEncounter } from "../../encounter/getEncounter";
import { flatMap, map, pipe } from "remeda";

export const getCharacterEncounters = (character: Character): Encounter[] =>
  pipe(
    character.activeEncounters.keys(),
    Array.from,
    map(getEncounter),
    flatMap((x) => (x ? [x] : []))
  );
