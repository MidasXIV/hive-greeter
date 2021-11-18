import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { barFight } from "../encounters/tavern/barFight";

export const command = new SlashCommandBuilder()
  .setName("bar_fight")
  .setDescription("Start a bar brawl.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await barFight(interaction, false);
};

export default { command, execute };
