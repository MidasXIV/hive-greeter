import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter } from "../gameState";
import { cooldownRemainingText } from "../utils";

export const command = new SlashCommandBuilder()
  .setName("cooldowns")
  .setDescription("Check your cooldowns.");

type x = keyof Character["cooldowns"];
const cooldowns: x[] = ["attack", "adventure", "heal"];

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await interaction.reply({
    fetchReply: true,
    embeds: [cooldownsRemainingEmbed(getUserCharacter(interaction.user))],
  });
};

export default { command, execute };

const cooldownsRemainingEmbed = (character: Character) =>
  new MessageEmbed({
    title: `${character.name}'s Cooldowns`,
    fields: cooldowns.map((name) => ({
      name,
      value: cooldownRemainingText(character.id, name),
    })),
    timestamp: Date.now(),
  });
