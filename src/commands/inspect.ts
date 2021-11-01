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
  // await interaction.reply({
  //   embeds: [characterEmbed(character)],
  // });
  // TODO: interval updates
  const message = await interaction.reply({
    embeds: [characterEmbed(character)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;
  if (getCooldownRemaining(character.id) ?? 0 <= 0) return;
  const interval = setInterval(async () => {
    const cooldown = getCooldownRemaining(character.id) ?? 0;
    if (cooldown <= 0) {
      console.log("inspect timer cleared", cooldown);
      clearTimeout(interval);
    }
    try {
      await message.edit({ embeds: [characterEmbed(character)] });
    } catch (e) {
      console.error(e);
      clearTimeout(interval);
    }
  }, 5000);
};

export default { command, execute };

export const cooldownRemainingText = (characterId: string): string => {
  const cooldown = getCooldownRemaining(characterId);
  if (cooldown === undefined) return "No actions taken.";
  console.log(cooldown, moment().add(cooldown, "milliseconds").fromNow());
  if (cooldown <= 0) return "Now";
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
        name: "Last Action",
        value: `${character.lastAction}`,
      },
      {
        name: "Action Available",
        value: cooldownRemainingText(character.id),
      },
      {
        name: "Profile",
        value: `${character.profile}`,
      },
    ]);
