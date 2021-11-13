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
import { Encounter } from "../../monster/Encounter";
import { AttackResult } from "../../attack/AttackResult";
import { awardXP } from "../../character/awardXP";
import { characterAttack } from "../../attack/characterAttack";
import { Character } from "../../character/Character";
import { getCharacterUpdate } from "../../character/getCharacterUpdate";
import { getMonsterUpate } from "../../character/getMonsterUpdate";
import { loot } from "../../character/loot/loot";
import { updateMonster } from "../../updateMonster";
import { getCharacter } from "../../character/getCharacter";
import { randomUUID } from "crypto";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = getRandomMonster();
  let player = getUserCharacter(interaction.user);
  monster = createEncounter(monster, player);
  let round = 0;
  let fled = false;
  let timeout = false;
  const playerAttacks: AttackResult[] = [];
  const monsterAttacks: AttackResult[] = [];
  const message = await interaction.reply({
    embeds: monsterEmbeds(monster),
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (monster.hp > 0 && player.hp > 0 && !fled && !timeout) {
    console.log("monster while", monster.hp, player.hp, fled, timeout);
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
        ...monster.encounters.map(encounterEmbed),
      ],
    });
  }

  const summary = new MessageEmbed({
    title: `Fight summary`,
  });

  if (fled) {
    summary.addField("Fled", `You escaped with your life!`);
  }
  if (monster.hp === 0 && player.hp > 0) {
    summary.addField("Triumphant!", `You defeated the ${monster.name}! 🎉`);
    awardXP(player.id, monster.xpValue);
    summary.addField("XP Gained", monster.xpValue.toString());
    loot({ looterId: player.id, targetId: monster.id });
    summary.addField("GP Gained", ":gold: " + monster.gold.toString());
    if (player.quests.slayer) {
      const character = updateUserQuestProgess(interaction.user, "slayer", 1);
      if (character && character.quests.slayer)
        summary.addFields([questProgressField(character.quests.slayer)]);
    }
  }
  if (monster.hp > 0 && player.hp === 0) {
    summary.addField("Defeat!", `You were defeated by the ${monster.name}!`);
    awardXP(monster.id, player.xpValue);
    summary.addField("XP Gained", monster.xpValue.toString());
    adjustGold(player.id, monster.gold);
    loot({ looterId: monster.id, targetId: player.id });
    summary.addField("GP Looted", monster.gold.toString());
    // TODO: martyr quest
    // if (player.quests.martyr) {
    //   const character = updateUserQuestProgess(interaction.user, "martyr", 1);
    //   if (character && character.quests.martyr)
    //     summary.addFields([questProgressField(character.quests.martyr)]);
    // }
  }
  if (monster.hp === 0 && player.hp === 0) {
    summary.addField("Double Knockout!", "You were both knocked out!");
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

const encounterEmbed = (encounter: Encounter) => {
  const character = getCharacter(encounter.characterId);
  if (!character)
    return new MessageEmbed({
      title: `Character ${encounter.characterId} not found`,
    });
  return new MessageEmbed({
    title: `Encountered ${character.name}`,
    timestamp: encounter.date,
  }).setThumbnail(character.profile);
};

function createEncounter(monster: Monster, player: Character) {
  const encounter: Encounter = {
    characterId: player.id,
    date: new Date().toString(),
    id: randomUUID(),
  };
  monster = updateMonster({
    ...monster,
    encounters: [...monster.encounters, encounter],
  });
  return monster;
}

function monsterEmbeds(monster: Monster): MessageEmbed[] {
  return [monsterEmbed(monster), ...monster.encounters.map(encounterEmbed)];
}

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
  return monsterEmbed(monster)
    .addFields([
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
    ])
    .addField(...attackField(monsterResult))
    .addField(...attackField(playerResult));
}
