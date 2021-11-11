import { progressBar } from "../utils/progress-bar";
import { Quest } from "./Quest";

export const questProgressBar = (quest: Quest): string =>
  progressBar(quest.progress / quest.totalRequired);
