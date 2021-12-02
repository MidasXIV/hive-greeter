import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { hpBarField } from "../character/hpBar/hpBarField";

export const command = new SlashCommandBuilder()
  .setName("hp")
  .setDescription("Show your hp");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  interaction.editReply({
    embeds: [
      new MessageEmbed({
        fields: [hpBarField(getUserCharacter(interaction.user))],
      }),
    ],
  });
};

export default { command, execute };
