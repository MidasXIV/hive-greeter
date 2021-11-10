import { Character } from "../character/Character";
import { Quest } from "./Quest";
import { isQuestComplete } from "./isQuestComplete";

export const getCompletedQuests = (character: Character): Map<string, Quest> =>
  new Map(
    Object.entries(character.quests).filter(([, quest]) =>
      isQuestComplete(quest)
    )
  );
