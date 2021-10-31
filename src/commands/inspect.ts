import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character, getUserCharacter } from "../db";

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
  const character = getUserCharacter(user);
  interaction.reply({
    embeds: [characterEmbed(character)],
  });
};

export default { command, execute };
export const characterEmbed = (character: Character): MessageEmbed =>
  new MessageEmbed()
    .setTitle(character.name)
    .setImage(character.profile)
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
      {
        name: "Profile",
        value: `${character.profile}`,
      },
    ]);
