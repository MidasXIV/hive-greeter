import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { playerAttack } from "../attack/playerAttack";
import { attack } from "../attack/attack";
import { attackFlavorText, attackRollText } from "../commands/attack";
import { chest } from "./chest";
import { isUserQuestComplete } from "../quest/isQuestComplete";
import quests from "../commands/quests";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { questProgressField } from "../quest/questProgressField";
import { getCharacter } from "../character/getCharacter";
import { getUserCharacter } from "../character/getUserCharacter";
import { getRandomMonster } from "../monster/getRandomMonster";
import { createEncounter } from "../encounter/createEncounter";
import { Monster } from "../monster/Monster";
import { encounterInProgressEmbed } from "./encounterInProgressEmbed";
import { AttackResult } from "../attack/AttackResult";
import { Character } from "../character/Character";
import { Encounter } from "../monster/Encounter";
import { adjustHP } from "../character/adjustHP";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import { xpGainField } from "../character/xpGainField";
import { hpBarField } from "../character/hpBar/hpBarField";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = await getRandomMonster();
  let player = getUserCharacter(interaction.user);
  console.log("monster encounter", monster, player);
  const encounter = createEncounter({ monster, player });
  let timeout = false;
  const message = await interaction.reply({
    embeds: [encounterInProgressEmbed(encounter)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (encounter.outcome === "in progress") {
    encounter.rounds++;
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
    const reaction = collected?.first();
    if (
      !collected ||
      timeout ||
      !reaction ||
      (reaction && reaction.emoji.name === "🏃‍♀️")
    ) {
      encounter.outcome = "player fled";
    }

    const playerResult =
      encounter.outcome == "player fled"
        ? undefined
        : attack(player.id, monster.id);
    const monsterResult = attack(monster.id, player.id);
    playerResult && encounter.playerAttacks.push(playerResult);
    monsterResult && encounter.monsterAttacks.push(monsterResult);

    const updatedMonster = getCharacter(monster.id);
    const updatedPlayer = getCharacter(player.id);
    if (!updatedMonster || !updatedPlayer || !monsterResult) return;
    monster = updatedMonster as Monster; // todo: fixme
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
    switch (true) {
      case player.hp > 0 && monster.hp === 0:
        encounter.outcome = "player victory";
        encounter.lootResult =
          loot({
            looterId: player.id,
            targetId: monster.id,
          }) ?? undefined;
        encounter.goldLooted = monster.gold;
        if (player.quests.slayer) {
          updateUserQuestProgess(interaction.user, "slayer", 1);
        }
        break;
      case player.hp === 0 && monster.hp > 0:
        encounter.outcome = "player defeated";
        encounter.goldLooted = player.gold;
        encounter.lootResult =
          loot({ looterId: monster.id, targetId: player.id }) ?? undefined;
        adjustHP(monster.id, monster.maxHP - monster.hp); // TODO: heal over time instead of immediately
        break;
      case player.hp === 0 && monster.hp === 0:
        encounter.outcome = "double ko";
        break;
    }

    message.edit({
      embeds: [
        encounterInProgressEmbed(encounter),
        attackExchangeEmbed({
          monster,
          player,
          playerAttack: playerResult,
          monsterAttack: monsterResult,
        }),
      ],
    });
  }

  message.reactions.removeAll();

  await message.reply({
    embeds: [
      encounterSummaryEmbed({
        encounter,
        monster,
        character: player,
        interaction,
      }),
    ].concat(encounter.lootResult ? lootResultEmbed(encounter.lootResult) : []),
  });

  if (encounter.outcome === "player victory" && Math.random() <= 0.3)
    await chest(interaction, true);
  if (
    isUserQuestComplete(interaction.user, "slayer") ||
    isUserQuestComplete(interaction.user, "survivor")
  )
    await quests.execute(interaction, "followUp");
};

function attackExchangeEmbed({
  monster,
  player,
  playerAttack,
  monsterAttack,
}: {
  monster: Monster;
  player: Character;
  playerAttack: AttackResult | void;
  monsterAttack: AttackResult | void;
}): MessageEmbed {
  const playerDamage =
    playerAttack && playerAttack.outcome === "hit" ? -playerAttack.damage : 0;
  const monsterDamage =
    monsterAttack && monsterAttack.outcome === "hit"
      ? -monsterAttack.damage
      : 0;
  const embed = new MessageEmbed({
    fields: [
      hpBarField(monster, playerDamage, true),
      hpBarField(player, monsterDamage, true),
    ],
  });

  if (monsterAttack) embed.addField(...attackField(monsterAttack));
  if (playerAttack) {
    embed.addField(...attackField(playerAttack));
  }
  return embed;
}

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

function encounterSummaryEmbed({
  encounter,
  monster,
  character,
  interaction,
}: {
  encounter: Encounter;
  monster: Monster;
  character: Character;
  interaction: CommandInteraction;
}): MessageEmbed {
  const summary = new MessageEmbed({ title: "Encounter Summary" });

  switch (encounter.outcome) {
    case "double ko":
      summary.addField("Double KO!", `You knocked eachother out!`);
      break;
    case "in progress":
      summary.addField("In Progress", "Encounter in progress.");
      break;
    case "monster fled":
      summary.addField("Evaded!", `${monster.name} escaped!`);
      break;
    case "player defeated":
      summary.addField("Unconscious", `${character.name} knocked out!`);
      if (encounter.goldLooted) {
        summary.addField("Looted!", `Lost 💰 ${encounter.goldLooted}!`);
      }
      break;
    case "player fled":
      summary.addField("Fled", `${character.name} escaped with their life!`);
      break;
    case "player victory":
      summary.addField(
        "Triumphant!",
        `${character.name} defeated the ${monster.name}! 🎉`
      );
      // summary.addField("XP Gained", "🧠 " + monster.xpValue.toString());
      summary.addFields([xpGainField(interaction)]);
      summary.addField("GP Gained", "💰 " + monster.gold.toString());
      if (character && character.quests.slayer)
        summary.addFields([questProgressField(character.quests.slayer)]);
      break;
  }

  return summary;
}
