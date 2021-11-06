import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { chest } from "./encounters/chest";

export const command = new SlashCommandBuilder()
  .setName("chest")
  .setDescription("Find a chest");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await chest(interaction);
};

export default { command, execute };
