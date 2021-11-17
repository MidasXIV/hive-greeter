import { EmbedFieldData, Interaction } from "discord.js";
import { Emoji } from "../Emoji";

export const damgeTakenField = (
  i: Interaction,
  adjust = 0
): EmbedFieldData => ({
  name: `HP Lost`,
  value: Emoji(i, "damage") + " " + adjust,
});
