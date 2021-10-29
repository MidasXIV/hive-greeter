import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// todo: https://discordjs.guide/interactions/registering-slash-commands.html#subcommands
// use addUserOption to specify target

export const command = new SlashCommandBuilder()
  .setName("attack")
  .setDescription("Make an attack");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await interaction.reply("pow!");
};

export default { command, execute };
