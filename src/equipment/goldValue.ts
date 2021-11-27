import { CommandInteraction } from "discord.js";
import { Item } from "./Item";
import { Emoji } from "../Emoji";

export const goldValue = (
  item: Item,
  interaction: CommandInteraction
): string => Emoji(interaction, "gold") + " " + item.goldValue;
