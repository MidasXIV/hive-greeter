import { Character } from "../character/Character";
import { getCharacter } from "../gameState";
import { QuestId } from "./quests";

export const addQuestProgress = (
  characterId: string,
  questId: QuestId,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
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
