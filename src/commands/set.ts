import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, Options } from "discord.js";
import { getHP, getMaxHP, setProfile } from "../db";

export const command = new SlashCommandBuilder()
  .setName("set")
  .setDescription("Configure your character")
  .addStringOption((option) =>
    option
      .setName("profile")
      .setDescription(`Set your character's profile picture.`)
      .setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const url = interaction.options.data[0].value?.toString();
  if (!url) return;
  setProfile(interaction.user.id, url);
  interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Orc")
        .setThumbnail(url)
        .addFields([
          {
            name: "HP",
            value: `${getHP(interaction.user.id)}/${getMaxHP(
              interaction.user.id
            )}`,
          },
        ]),
    ],
  });
};

export default { command, execute };
