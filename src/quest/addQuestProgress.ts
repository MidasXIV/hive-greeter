import { Character } from "../character/Character";
import { QuestId } from "./quests";

export const addQuestProgress = (
  character: Character,
  questId: QuestId,
  amount: number
): Character => {
  const quest = character.quests[questId];
  if (!quest) return character;
  return {
    ...character,
    quests: {
      ...character.quests,
      [questId]: {
        ...quest,
        progress: quest.progress + amount,
      },
    },
  };
};
