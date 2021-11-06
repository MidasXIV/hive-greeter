import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import {
  attackPlayer,
  getCharacter,
  createCharacter,
  Character,
  getUserCharacter,
  attack,
  awardXP,
  awardGold,
  setGold,
} from "../../db";
import { hpBar } from "../../utils/hp-bar";
import { attackFlavorText, attackRollText } from "../attack";
import { chest } from "./chest";

const getRandomMonster = () => {
  const rand = Math.random();
  switch (true) {
    case rand > 0.6:
      return createCharacter({
        name: "Orc",
        profile: "https://i.imgur.com/2cT3cLm.jpeg",
        gold: Math.floor(Math.random() * 6) + 2,
      });
    case rand > 0.3:
      return createCharacter({
        hp: 8,
        maxHP: 8,
        name: "Bandit",
        profile: "https://i.imgur.com/MV96z4T.png",
        xpValue: 4,
        gold: Math.floor(Math.random() * 5) + 1,
      });

    default:
      return createCharacter({
        hp: 5,
        maxHP: 5,
        name: "Goblin",
        profile: "https://i.imgur.com/gPH1JSl.png",
        xpValue: 3,
        gold: Math.floor(Math.random() * 3) + 1,
      });
  }
};

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = getRandomMonster();
  let player = getUserCharacter(interaction.user);
  let round = 0;
  let fled = false;
  let timeout = false;
  const playerAttacks = [];
  const monsterAttacks = [];
  const message = await interaction.reply({
    embeds: [monsterEmbed(monster)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (monster.hp > 0 && player.hp > 0 && !fled && !timeout) {
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
    if (!collected || timeout) {
      await interaction.followUp(`Timed out`);
      return;
    }
    const reaction = collected.first();
    if (!reaction) {
      await interaction.followUp(`No reaction received.`);
      return;
    }

    if (reaction.emoji.name === "🏃‍♀️") {
      fled = true;
      break;
    }

    const playerResult = attack(player.id, monster.id);
    playerAttacks.push(playerResult);
    const monsterResult = attack(monster.id, player.id);
    monsterAttacks.push(monsterResult);

    const updatedMonster = getCharacter(monster.id);
    const updatedPlayer = getCharacter(player.id);
    if (!updatedMonster || !updatedPlayer || !playerResult || !monsterResult)
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
    message.edit({
      embeds: [
        monsterEmbed(monster)
          .addField("Round", round.toString(), true)
          .addField(
            `${monster.name}'s HP`,
            `${hpBar(
              monster,
              playerResult.outcome === "hit" ? -playerResult.damage : 0
            )}`
          )
          .addField(
            `${player.name}'s HP`,
            `${hpBar(
              player,
              monsterResult.outcome === "hit" ? -monsterResult.damage : 0
            )}`
          )
          .addField(...attackField(monsterResult))
          .addField(...attackField(playerResult)),
      ],
    });
  }

  const summary = new MessageEmbed().setDescription(`Fight summary`);

  if (fled) summary.addField("Fled", `You escaped with your life!`);
  if (monster.hp === 0 && player.hp > 0) {
    summary.addField("Triumphant!", `You defeated the ${monster.name}! 🎉`);
    awardXP(player.id, monster.xpValue);
    summary.addField("XP Gained", monster.xpValue.toString());
    awardGold(player.id, monster.gold);
    summary.addField("GP Gained", monster.gold.toString());
  }
  if (player.hp === 0) {
    summary.addField("Unconscious", "You were knocked out!");
    if (monster.hp > 0 && player.gold > 0) {
      setGold(player.id, 0);
      summary.addField("Looted", `You lost 💰${player.gold} gold!`);
    }
  }

  message.reactions.removeAll();

  await message.reply({
    embeds: [summary],
  });

  if (player.hp > 0 && Math.random() <= 0.3) {
    await chest(interaction, true);
  }
};

const attackField = (
  result: ReturnType<typeof attackPlayer>
): [string, string] => [
  result
    ? result.outcome === "cooldown"
      ? "cooldown"
      : `${result.attacker.name}'s attack`
    : "No result.",
  result
    ? `${attackFlavorText(result)}\n${attackRollText(result)}${
        result.outcome === "hit" ? "\n🩸 " + result.damage.toString() : ""
      }`
    : "No result.",
];

const monsterEmbed = (monster: Character) =>
  new MessageEmbed()
    .setTitle(monster.name)
    .setColor("RED")
    .setImage(monster.profile);
