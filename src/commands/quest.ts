import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { chattyTavernkeepers } from "./encounters/tavern/chattyTavernkeepers";

export const command = new SlashCommandBuilder()
  .setName("quest")
  .setDescription("Test output of chatty tavernkeepers.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await chattyTavernkeepers(interaction);
};

export default { command, execute };
