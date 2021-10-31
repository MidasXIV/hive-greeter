import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageAttachment,
  MessageEmbed,
} from "discord.js";
import { getCharacter } from "../db";

export const command = new SlashCommandBuilder()
  .setName("inspect")
  .setDescription("Inspect someone.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to inspect")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const user =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user;
  const character = getCharacter(user.id);
  interaction.reply({
    files: [new MessageAttachment("./profile.png")],
    embeds: [
      new MessageEmbed()
        .setTitle(user.username)
        .setImage("attachment://profile.png")
        .addFields([
          {
            name: "HP",
            value: `${character.hp}/${character.maxHP}`,
          },
          {
            name: "AC",
            value: `${character.ac}`,
          },
          {
            name: "Attack Bonus",
            value: `${character.attackBonus}`,
          },
          {
            name: "Last Action",
            value: `${character.lastAction}`,
          },
        ]),
    ],
  });
};

export default { command, execute };
