import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../gameState";
import { hpBarField } from "./inspect";

export const command = new SlashCommandBuilder()
  .setName("hpbar")
  .setDescription("Show hp bar variants.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  interaction.reply({
    embeds: [
      new MessageEmbed({
        title: "HP Bar",
        fields: [
          hpBarField(getUserCharacter(interaction.user), 3),
          hpBarField(getUserCharacter(interaction.user), -3),
        ],
      }),
    ],
  });
};

export default { command, execute };
