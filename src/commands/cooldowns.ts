import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter } from "../character/getUserCharacter";
import { cooldownRemainingText } from "../character/cooldownRemainingText";

export const command = new SlashCommandBuilder()
  .setName("cooldowns")
  .setDescription("Check your cooldowns.");

type Cooldowns = keyof Character["cooldowns"];
const cooldowns: Cooldowns[] = ["attack", "adventure", "heal"];

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await interaction.reply({
    fetchReply: true,
    embeds: [cooldownsRemainingEmbed(getUserCharacter(interaction.user))],
  });
};

export default { command, execute };

const cooldownEmojis = new Map<Cooldowns, string>([
  ["adventure", "🚶‍♀️"],
  ["attack", "⚔"],
  ["heal", "🤍"],
]);

const cooldownsRemainingEmbed = (character: Character) =>
  new MessageEmbed({
    title: `${character.name}'s Cooldowns`,
    fields: cooldowns.map((name) => ({
      name,
      value:
        cooldownEmojis.get(name) +
        " " +
        cooldownRemainingText(character.id, name),
    })),
    timestamp: Date.now(),
  });
