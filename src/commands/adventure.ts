import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import {
  getUserCharacter,
  isCharacterOnCooldown,
  setCharacterCooldown,
} from "../db";
import { randomEncounter } from "./encounters/random-encounter";

export const command = new SlashCommandBuilder()
  .setName("adventure")
  .setDescription("Set off in search of glory.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const player = getUserCharacter(interaction.user);
  if (player.hp === 0) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`You're too weak to press on.`)
          .setImage("https://imgur.com/uD06Okr.png"),
      ],
    });
    return;
  }
  if (isCharacterOnCooldown(player.id, "adventure")) {
    await interaction.reply({
      embeds: [new MessageEmbed().setDescription(`You can't do that yet.`)],
    });
    return;
  }
  setCharacterCooldown(player.id, "adventure");
  await randomEncounter()(interaction);
};

export default { command, execute };
