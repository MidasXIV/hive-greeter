import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import {
  attack,
  getCharacter,
  createCharacter,
  Character,
  getUserCharacter,
} from "../db";
import { attackFlavorText, attackRollText } from "./attack";

export const command = new SlashCommandBuilder()
  .setName("monster")
  .setDescription("Fight a monster!");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = createCharacter({
    name: "Orc",
    profile: "https://i.imgur.com/2cT3cLm.jpeg",
  });
  let player = getUserCharacter(interaction.user);
  let round = 0;
  let fled = false;
  let timeout = false;
  const message = await interaction.reply({
    embeds: [monsterEmbed(monster)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (monster.hp > 0 && !fled && !timeout) {
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

    const playerResult = attack(player, monster);
    const enemyResult = attack(monster, player);

    const updatedMonster = getCharacter(monster.id);
    const updatedPlayer = getCharacter(player.id);
    if (!updatedMonster || !updatedPlayer || !playerResult || !enemyResult)
      return;
    monster = updatedMonster;
    player = updatedPlayer;

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
    console.log({ monsterProfile: monster.profile });
    message.edit({
      embeds: [
        monsterEmbed(monster)
          .addField("Round", round.toString())
          .addField(monster.name, attackFlavorText(enemyResult))
          .addField(monster.name, attackRollText(enemyResult))
          .addField(player.name, attackFlavorText(playerResult))
          .addField(player.name, attackRollText(playerResult)),
      ],
    });
  }

  if (fled) await message.reply(`You escape with your life!`);
  if (monster.hp === 0) await message.reply(`You defeated the monster!`);
  if (getUserCharacter(interaction.user).hp === 0)
    await message.reply(`You were defeated!`);

  // TODO: reward, xp? loot?
};

const monsterEmbed = (monster: Character) =>
  new MessageEmbed()
    .setTitle(monster.name)
    .setThumbnail(monster.profile)
    .addFields([
      {
        name: "HP",
        value: `${monster.hp}/${monster.maxHP}`,
      },
    ]);

export default { command, execute };
