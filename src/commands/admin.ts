import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

export const command = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Admins only.")
  .addStringOption((option) => option.setName("apply_uuids"));

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  console.log(interaction.options.getSubcommand());
  interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Dance!")
        .setImage(
          "http://www.gamergeoff.com/images/dancing/halfling%20dance2%20male.gif"
        ),
    ],
  });
};

export default { command, execute };
