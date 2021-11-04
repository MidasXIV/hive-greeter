import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import {
  attackPlayer,
  getCharacter,
  createCharacter,
  Character,
  getUserCharacter,
  attack,
  gainXP,
} from "../../db";
import { attackFlavorText, attackRollText } from "../attack";

const getRandomMonster = () => {
  const rand = Math.random();
  switch (true) {
    case rand > 0.6:
      return createCharacter({
        name: "Orc",
        profile: "https://i.imgur.com/2cT3cLm.jpeg",
      });
    case rand > 0.3:
      return createCharacter({
        hp: 8,
        maxHP: 8,
        name: "Bandit",
        profile: "https://i.imgur.com/MV96z4T.png",
        xpValue: 4,
      });

    default:
      return createCharacter({
        hp: 5,
        maxHP: 5,
        name: "Goblin",
        profile: "https://i.imgur.com/gPH1JSl.png",
        xpValue: 3,
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
      console.error("no monster reaction collected");
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
          .addField("Round", round.toString())
          .addField(`${player.name}'s HP`, `${player.hp}/${player.maxHP}`)
          .addField(...attackField(monsterResult))
          .addField(...attackField(playerResult)),
      ],
    });
  }

  const summary = new MessageEmbed().setDescription(`Fight summary`);

  if (fled) summary.addField("Fled", `You escaped with your life!`);
  if (monster.hp === 0) {
    gainXP(player.id, monster.xpValue);
    summary.addField("Enemy Defeated", `You defeated the ${monster.name}! 🎉`);
    summary.addField("XP Gained", monster.xpValue.toString());
  }
  if (player.hp === 0) summary.addField("Unconscious", "You were knocked out!");

  message.reactions.removeAll();

  message.reply({
    embeds: [summary],
  });
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
    ? `${attackFlavorText(result)}\n\`${attackRollText(result)}\``
    : "No result.",
];

const monsterEmbed = (monster: Character) =>
  new MessageEmbed()
    .setTitle(monster.name)
    .setColor("RED")
    .setImage(monster.profile)
    .addFields([
      {
        name: `${monster.name}'s HP`,
        value: `${monster.hp}/${monster.maxHP}`,
      },
    ]);
