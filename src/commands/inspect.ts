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
  const message = await interaction.reply({
    embeds: [characterEmbed(character)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;
  const interval = setInterval(() => {
    const cooldown = getCooldownRemaining(character.id) ?? 0;
    if (cooldown <= 0) {
      console.log("inspect timer cleared", cooldown);
      clearTimeout(interval);
    }
    message.edit({ embeds: [characterEmbed(character)] });
  }, 1000);
};

export default { command, execute };

export const cooldownRemainingText = (characterId: string): string => {
  const cooldown = getCooldownRemaining(characterId);
  if (cooldown === undefined) return "No actions taken.";
  return moment().add(cooldown).fromNow();
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
        name: "Last Action",
        value: `${character.lastAction} ${moment().add()}`,
      },
      {
        name: "Can Act Again",
        value: cooldownRemainingText(character.id),
      },
      {
        name: "Profile",
        value: `${character.profile}`,
      },
    ]);
