import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import moment from "moment";
import { Character, getCooldownRemaining, getUserCharacter } from "../db";

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
  await interaction.reply({
    embeds: [characterEmbed(character)],
    fetchReply: true,
  });
};

export default { command, execute };

export const cooldownRemainingText = (
  characterId: string,
  type: keyof Character["cooldowns"]
): string => {
  const cooldown = getCooldownRemaining(characterId, type);
  if (cooldown === undefined || cooldown <= 0) return "Now";
  return moment().add(cooldown, "milliseconds").fromNow();
};

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
        name: "Attack Available",
        value: cooldownRemainingText(character.id, "attack"),
      },
      {
        name: "Adventure Available",
        value: cooldownRemainingText(character.id, "adventure"),
      },
      {
        name: "Heal Available",
        value: cooldownRemainingText(character.id, "adventure"),
      },
      {
        name: "Profile",
        value: `${character.profile}`,
      },
    ]);
