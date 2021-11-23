import { EmbedFieldData, Interaction } from "discord.js";
import { Emoji } from "../Emoji";

export const gpGainField = (i: Interaction, adjust = 0): EmbedFieldData => ({
  name: `GP Gained`,
  value: Emoji(i, "gold") + " +" + adjust,
});
