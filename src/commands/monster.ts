import { SlashCommandBuilder } from "@discordjs/builders";
import { randomUUID } from "crypto";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { getHP, getMaxHP, attack } from "../db";

export const command = new SlashCommandBuilder()
  .setName("monster")
  .setDescription("Fight a monster!");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  // const initiator = interaction.member.user;

  const monsterId = randomUUID();
  let round = 0;
  let fled = false;
  let timeout = false;
  const message = await interaction.reply({
    embeds: [monsterEmbed(monsterId)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (getHP(monsterId) > 0 && !fled && !timeout) {
    round++;
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

    // await reaction.remove();
    const userReactions = message.reactions.cache.filter((reaction) =>
      reaction.users.cache.has(interaction.user.id)
    );

    try {
      for (const reaction of userReactions.values()) {
        await reaction.users.remove(interaction.user.id);
      }
    } catch (error) {
      console.error("Failed to remove reactions.");
    }

    message.edit({
      embeds: [
        monsterEmbed(monsterId)
          .addField("Round", round.toString())
          .addField(
            "Orc",
            enemyResult.outcome == "hit"
              ? `hit (${enemyResult.attackRoll}) for ${enemyResult.damage}!`
              : `missed!  (${enemyResult.attackRoll})`
          )
          .addField(
            "You",
            playerResult.outcome == "hit"
              ? `hit (${playerResult.attackRoll}) ${playerResult.damage}!`
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
