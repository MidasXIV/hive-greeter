import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { adjustGold } from "../../character/adjustGold";
import { getUserCharacter } from "../../character/getUserCharacter";
import { playerAttack } from "../../attack/playerAttack";
import { hpBar } from "../../character/hpBar/hpBar";
import { attackFlavorText, attackRollText } from "../attack";
import { chest } from "./chest";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import quests from "../quests";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import { questProgressField } from "../../quest/questProgressField";
import { getRandomMonster } from "../../monster/getRandomMonster";
import { Monster } from "../../monster/Monster";
import { AttackResult } from "../../attack/AttackResult";
import { awardXP } from "../../character/awardXP";
import { characterAttack } from "../../attack/characterAttack";
import { getMonsterUpate } from "../../character/getMonsterUpdate";
import { Character } from "../../character/Character";
import { getCharacterUpdate } from "../../character/getCharacterUpdate";
import { setGold } from "../../character/setGold";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = getRandomMonster();
  let player = getUserCharacter(interaction.user);
  let round = 0;
  let fled = false;
  let timeout = false;
  const playerAttacks: AttackResult[] = [];
  const monsterAttacks: AttackResult[] = [];
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

    const playerResult = characterAttack(player, monster);
    const monsterResult = characterAttack(monster, player);
    monsterAttacks.push(monsterResult);
    playerAttacks.push(playerResult);
    monster = getMonsterUpate(monster);
    player = getCharacterUpdate(player);

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
        monsterExchangeDetails({
          monster,
          round,
          playerResult,
          player,
          monsterResult,
        }),
      ],
    });
  }

  const summary = new MessageEmbed().setDescription(`Fight summary`);

  if (fled) {
    summary.addField("Fled", `You escaped with your life!`);
  }
  if (monster.hp === 0 && player.hp > 0) {
    summary.addField("Triumphant!", `You defeated the ${monster.name}! 🎉`);
    awardXP(player.id, monster.xpValue);
    summary.addField("XP Gained", monster.xpValue.toString());
    adjustGold(player.id, monster.gold);
    summary.addField("GP Gained", monster.gold.toString());
    if (player.quests.slayer) {
      const character = updateUserQuestProgess(interaction.user, "slayer", 1);
      if (character && character.quests.slayer)
        summary.addFields([questProgressField(character.quests.slayer)]);
    }
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

  if (!fled && player.hp > 0 && Math.random() <= 0.3)
    await chest(interaction, true);
  if (
    isUserQuestComplete(interaction.user, "slayer") ||
    isUserQuestComplete(interaction.user, "survivor")
  )
    await quests.execute(interaction, "followUp");
};

const attackField = (
  result: ReturnType<typeof playerAttack>
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

const monsterEmbed = (monster: Monster) =>
  new MessageEmbed()
    .setTitle(monster.name)
    .setColor("RED")
    .setImage(monster.profile);

function monsterExchangeDetails({
  monster,
  round,
  playerResult,
  player,
  monsterResult,
}: {
  monster: Monster;
  round: number;
  playerResult: AttackResult;
  player: Character;
  monsterResult: AttackResult;
}) {
  const embed = monsterEmbed(monster).addFields([
    {
      name: "Round",
      value: round.toString(),
      inline: true,
    },
    {
      name: `${monster.name}'s HP`,
      value: `${hpBar(
        monster,
        playerResult.outcome === "hit" ? -playerResult.damage : 0
      )}`,
    },
    {
      name: `${player.name}'s HP`,
      value: `${hpBar(
        player,
        monsterResult.outcome === "hit" ? -monsterResult.damage : 0
      )}`,
    },
  ]);
  console.log(attackField(monsterResult), attackField(playerResult));
  embed
    .addField(...attackField(monsterResult))
    .addField(...attackField(playerResult));
  return embed;
}
