import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { playerAttack } from "../../attack/playerAttack";
import { hpBar } from "../../character/hpBar/hpBar";
import { attackFlavorText, attackRollText } from "../attack";
import { chest } from "./chest";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import quests from "../quests";
import { getRandomMonster } from "../../monster/getRandomMonster";
import { Monster } from "../../monster/Monster";
import { Encounter } from "../../monster/Encounter";
import { AttackResult } from "../../attack/AttackResult";
import { characterAttack } from "../../attack/characterAttack";
import { Character } from "../../character/Character";
import { getCharacterUpdate } from "../../character/getCharacterUpdate";
import { getMonsterUpate } from "../../character/getMonsterUpdate";
import { getCharacter } from "../../character/getCharacter";
import { createEncounter } from "../../encounter/createEncounter";
import { encounterSummary } from "./encounterSummary";
import { monsterEmbed } from "./monsterEmbed";
import { getCharacterEncounters } from "./getCharacterEncounters";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  let monster = getRandomMonster();
  let player = getUserCharacter(interaction.user);
  const encounter = createEncounter({ monster, player });
  let round = 0;
  let fled = false;
  let timeout = false;
  const message = await interaction.reply({
    embeds: monsterEmbeds(monster),
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  // TODO: consider do/while refactor?

  // TODO: while case never exits, hitpoints don't seem to update?
  while (
    getMonsterUpate(monster).hp > 0 &&
    getCharacterUpdate(player).hp > 0 &&
    !fled &&
    !timeout
  ) {
    console.log(
      "monster while",
      getMonsterUpate(monster).hp,
      getCharacterUpdate(player).hp,
      fled,
      timeout
    );
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
    encounter.monsterAttacks.push(monsterResult);
    encounter.playerAttacks.push(playerResult);
    monster = getMonsterUpate(monster);
    player = getCharacterUpdate(player);
    console.log("monster hp after update", monster.hp);

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
        encounterEmbed(encounter),
      ],
    });
  }
  debugger;

  const summary = encounterSummary({ fled, monster, player, interaction });

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

const encounterEmbed = (encounter: Encounter) => {
  const character = getCharacter(encounter.characterId);
  if (!character)
    return new MessageEmbed({
      title: `Character ${encounter.characterId} not found`,
      fields: [
        {
          name: "Result",
          value: encounter.result ?? "unknown",
          inline: true,
        },
      ],
      timestamp: encounter.date,
    });
  return new MessageEmbed({
    title: `Encountered ${character.name}`,
    fields: [
      {
        name: "In Progress",
        value: encounter.inProgress ? "Yes" : "No",
        inline: true,
      },
      {
        name: "Result",
        value: encounter.result ?? "unknown",
        inline: true,
      },
    ],
    timestamp: encounter.date,
  }).setThumbnail(character.profile);
};

function monsterEmbeds(monster: Monster): MessageEmbed[] {
  return [
    monsterEmbed(monster),
    ...getCharacterEncounters(monster).map(encounterEmbed),
  ];
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
