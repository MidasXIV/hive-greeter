import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { angels } from "../encounters/angels";

export const command = new SlashCommandBuilder()
  .setName("angels")
  .setDescription("Greet the divine agents.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await angels(interaction);
};

export default { command, execute };
