import { Quest } from "./Quest";

const questIds = [
  "slayer",
  "survivor",
  // "afflicted",
  // "traveler",
  // "blessed",
  // "healer",
  // "rogue",
] as const;

export type QuestId = typeof questIds[number];
export const isQuestId = (id: string): id is QuestId =>
  questIds.includes(id as QuestId);

// TODO: refactor to map.
export const quests: {
  [id in QuestId]: Quest;
} = {
  slayer: {
    id: "slayer",
    title: "Slayer",
    progress: 0,
    totalRequired: 10,
    objective: "Defeat 10 monsters",
    reward: "Gain a powerful weapon",
    repeatable: false,
  },
  survivor: {
    id: "survivor",
    title: "Survivor",
    progress: 0,
    totalRequired: 100,
    objective: "Survive 100 damage",
    reward: "Gain health.",
    repeatable: false,
  },
  // afflicted: {
  //   id: "afflicted",
  //   title: "Afflicted",
  //   progress: 0,
  //   totalRequired: 50,
  //   objective: "Become afflicted by 10 debuffs",
  //   reward: "Consume afflictions to gain strength.",
  //   repeatable: false,
  // },
  // traveler: {
  //   id: "traveler",
  //   title: "Traveler",
  //   progress: 0,
  //   totalRequired: 10,
  //   objective: "Travel the lands 10 times",
  //   reward: "Travel grants vigor.",
  //   repeatable: false,
  // },
  // blessed: {
  //   id: "blessed",
  //   title: "Blessed",
  //   progress: 0,
  //   totalRequired: 10,
  //   objective: "Receive 10 blessings.",
  //   reward: "Blessings now last an hour.",
  //   repeatable: false,
  // },
  // healer: {
  //   id: "healer",
  //   title: "Healer",
  //   progress: 0,
  //   totalRequired: 50,
  //   objective: "Heal 50 hp",
  //   reward: "??",
  //   repeatable: false,
  // },
  // rogue: {
  //   id: "rogue",
  //   title: 'Rogue',
  //   progress: 0,
  //   totalRequired: 15,
  //   objective: 'Evade '
  // },
};

export const getRandomQuests = (quests: Quest[], num = 3): Quest[] => {
  const available = [...quests];
  const results: Quest[] = [];
  while (results.length < num) {
    const i = Math.ceil(Math.random() * available.length);
    const quest = available[i];
    available.splice(i, 1);
    results.push(quest);
  }
  return results;
};
