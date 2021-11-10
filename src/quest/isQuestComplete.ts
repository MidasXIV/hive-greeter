import { Quest } from "./Quest";

export const isQuestComplete = (quest: Quest): boolean =>
  quest.progress >= quest.totalRequired;
