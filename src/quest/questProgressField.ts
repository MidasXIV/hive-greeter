import { EmbedField } from "discord.js";
import { Quest } from "./Quest";
import { questProgressBar } from "./questProgressBar";

export const questProgressField = (quest: Quest): EmbedField => ({
  name: quest.title,
  value: `${questProgressBar(quest)} ${quest.progress}/${quest.totalRequired}`,
  inline: true,
});
