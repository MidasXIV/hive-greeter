import { SlashCommandBuilder } from "@discordjs/builders";
import { randomUUID } from "crypto";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { adjustHP, getHP, getMaxHP, attack } from "../db";

export const command = new SlashCommandBuilder()
  .setName("monster")
  .setDescription("Fight a monster!");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  // const initiator = interaction.member.user;

  const monsterId = randomUUID();
  let fled = false;
  let timeout = false;
  let message = await interaction.reply({
    embeds: [monsterEmbed(monsterId)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (getHP(monsterId) > 0 && !fled && !timeout) {
    await message.react("⚔");
    await message.react("🏃‍♀️");
    const collected = await message
      .awaitReactions({
        filter: (reaction, user) =>
          ["⚔", "🏃‍♀️"].includes(String(reaction.emoji.name)) &&
          user.id === interaction.user.id,
        max: 1,
        time: 60000,
        errors: ["time"],
      })
      .catch(() => {
        timeout = true;
      });
    if (!collected || timeout) return;
    const reaction = collected.first();
    if (!reaction) return;

    if (reaction.emoji.name === "🏃‍♀️") {
      message.reply("You flee!");
      fled = true;
    }

    const playerResult = attack(interaction.user.id, monsterId);
    const enemyResult = attack(monsterId, interaction.user.id);

    await message.reactions.removeAll();

    message.edit({
      embeds: [
        monsterEmbed(monsterId)
          .addField(
            "Orc",
            enemyResult.outcome == "hit"
              ? `hit for ${enemyResult.damage}!`
              : `missed!`
          )
          .addField(
            "You",
            playerResult.outcome == "hit"
              ? `hit ${playerResult.damage}!`
              : `missed!`
          ),
      ],
    });
  }

  if (fled) await message.reply(`You escape with your life!`);
  if (getHP(monsterId) === 0) await message.reply(`You defeated the monster!`);
  if (getHP(interaction.member.user.id) === 0)
    await message.reply(`You were defeated!`);
};

const monsterEmbed = (monsterId: string) =>
  new MessageEmbed()
    .setTitle("Orc")
    .setThumbnail("https://i.imgur.com/2cT3cLm.jpeg")
    .addFields([
      {
        name: "HP",
        value: `${getHP(monsterId)}/${getMaxHP(monsterId)}`,
      },
    ]);

export default { command, execute };
