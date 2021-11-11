import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../gameState";
import { hpBarField } from "./inspect";

export const command = new SlashCommandBuilder()
  .setName("hp")
  .setDescription("Show your hp");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  interaction.reply({
    embeds: [
      new MessageEmbed({
        fields: [hpBarField(getUserCharacter(interaction.user))],
      }),
    ],
  });
};

export default { command, execute };
