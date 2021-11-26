import { EmbedFieldData, Interaction } from "discord.js";
import { Emoji } from "../Emoji";

export const xpGainField = (i: Interaction, adjust = 0): EmbedFieldData => ({
  name: `Experience Gained`,
  value: Emoji(i, "xp") + " +" + adjust,
});
