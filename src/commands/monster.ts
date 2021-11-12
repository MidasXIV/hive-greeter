import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { monster } from "./encounters/monster";

export const command = new SlashCommandBuilder()
  .setName("monster")
  .setDescription("Summon a monster");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  monster(interaction);
};

export default { command, execute };
