import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

export const command = new SlashCommandBuilder()
  .setName("dance")
  .setDescription("Do a little dance.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  interaction.reply({
    embeds: [
      new MessageEmbed({
        title: "Dance!",
      }).setImage(
        "http://www.gamergeoff.com/images/dancing/halfling%20dance2%20male.gif"
      ),
    ],
  });
};

export default { command, execute };
