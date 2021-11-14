import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Character } from "../../character/Character";
import { playerAttack } from "../../attack/playerAttack";
import { attack } from "../../attack/attack";
import { attackFlavorText, attackRollText } from "../attack";
import { chest } from "./chest";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import quests from "../quests";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import { questProgressField } from "../../quest/questProgressField";
import { getUserCharacter } from "../../character/getUserCharacter";
import { getRandomMonster } from "../../monster/getRandomMonster";
import { getMonsterUpate } from "../../character/getMonsterUpdate";
import { createEncounter } from "../../encounter/createEncounter";
import { encounterCard as encounterEmbed } from "./encounterEmbed";
import { loot } from "../../character/loot/loot";
import { getCharacterUpdate } from "../../character/getCharacterUpdate";
import { characterEncounterEmbed } from "../../character/characterEncounterEmbed";
import { Monster } from "../../monster/Monster";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = getRandomMonster();
  let player = getUserCharacter(interaction.user);
  const encounter = createEncounter({ monster, player });
  let timeout = false;
  const message = await interaction.reply({
    embeds: [monsterEmbed(monster), characterEncounterEmbed(player)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (
    monster.hp > 0 &&
    player.hp > 0 &&
    encounter.status === "in progress" &&
    !timeout
  ) {
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
        encounter.status = "retreat";
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
      encounter.status = "retreat";
    }

    let playerResult;
    if (encounter.status === "in progress") {
      playerResult = attack(player.id, monster.id);
      playerResult && encounter.playerAttacks.push(playerResult);
    }
    const monsterResult = attack(monster.id, player.id);
    monsterResult && encounter.monsterAttacks.push(monsterResult);

    const updatedMonster = getCharacterUpdate(monster);
    const updatedPlayer = getCharacterUpdate(player);
    monster = updatedMonster as Monster;
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
    const embeds = [
      monsterEmbed(monster),
      characterEncounterEmbed(player),
      characterEncounterEmbed(monster),
      encounterEmbed(encounter),
      new MessageEmbed({}).addField(...attackField(playerResult)),
      new MessageEmbed({}).addField(...attackField(monsterResult)),
      // .addField(...attackField(monsterResult))
    ];
    if (encounter.status === "in progress") {
      playerResult = attack(player.id, monster.id);
      playerResult && encounter.playerAttacks.push(playerResult);
    }

    message.edit({
      embeds,
    });
  }

  const summary = new MessageEmbed().setDescription(`Fight summary`);

  if (encounter.status === "retreat") {
    summary.addField("Fled", `You escaped with your life!`);
  }
  if (monster.hp === 0 && player.hp > 0) {
    encounter.status = "victory";
    summary.addField("Triumphant!", `You defeated the ${monster.name}! 🎉`);
    loot({ targetId: monster.id, looterId: player.id });
    summary.addField("XP Gained", monster.xpValue.toString());
    summary.addField("GP Gained", monster.gold.toString());
    if (player.quests.slayer) {
      const character = updateUserQuestProgess(interaction.user, "slayer", 1);
      if (character && character.quests.slayer)
        summary.addFields([questProgressField(character.quests.slayer)]);
    }
  }
  if (player.hp === 0) {
    summary.addField("😫 Unconscious", "You were knocked out!");
    if (monster.hp > 0) {
      encounter.status = "defeat";
      loot({ looterId: monster.id, targetId: player.id });
      summary.addField("Looted", `You lost 💰${player.gold} gold!`);
    } else {
      encounter.status = "defeat";
    }
  }

  message.reactions.removeAll();

  await message.reply({
    embeds: [summary],
  });

  if (encounter.status === "victory" && player.hp > 0 && Math.random() <= 0.3)
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

const monsterEmbed = (monster: Character) =>
  new MessageEmbed({
    title: monster.name,
    color: "RED",
  }).setImage(monster.profile);
