import { Character } from "../character/Character";

const questIds = [
  "slayer",
  "survivor",
  "afflicted",
  "traveler",
  "blessed",
] as const;

export type QuestId = typeof questIds[number];
export const isQuestId = (id: string): id is QuestId =>
  questIds.includes(id as QuestId);

export type Quest = {
  title: string;
  progress: number;
  totalRequired: number;
  objective: string;
  reward: string;
};

export const quests: { [id in QuestId]: Quest } = {
  slayer: {
    title: "Slayer",
    progress: 0,
    totalRequired: 10,
    objective: "Defeat 10 monsters",
    reward: "Gain a powerful weapon",
  },
  survivor: {
    title: "Survivor",
    progress: 0,
    totalRequired: 100,
    objective: "Survive 100 damage",
    reward: "Gain health.",
  },
  afflicted: {
    title: "Afflicted",
    progress: 0,
    totalRequired: 50,
    objective: "Be afflicted 10 times",
    reward: "Consume afflictions to gain strength.",
  },
  traveler: {
    title: "Traveler",
    progress: 0,
    totalRequired: 10,
    objective: "Travel the lands 10 times",
    reward: "Travel grants you vigor.",
  },
  blessed: {
    title: "Blessed",
    progress: 0,
    totalRequired: 10,
    objective: "Receive 10 blessings.",
    reward: "Blessings now last an hour.",
  },
};

const isQuestComplete = (quest: Quest) => quest.progress >= quest.totalRequired;

export const getCompletedQuests = (
  character: Character
): Map<string, Quest> => {
  const x = Object.entries(character.quests);
  const filtered = x.filter(([, quest]) => isQuestComplete(quest));
  return new Map(filtered);
};

export const grantQuest = (
  character: Character,
  questId: QuestId
): Character => ({
  ...character,
  quests: { ...character.quests, [questId]: { ...quests[questId] } },
});

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
