import { QuestId } from "./quests";

export type Quest = {
  id: QuestId;
  title: string;
  progress: number;
  totalRequired: number;
  objective: string;
  reward: string;
  repeatable: boolean;
};
