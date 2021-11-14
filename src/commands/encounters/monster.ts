import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Character } from "../../character/Character";
import { playerAttack } from "../../attack/playerAttack";
import { attack } from "../../attack/attack";
import { hpBar } from "../../character/hpBar/hpBar";
import { attackFlavorText, attackRollText } from "../attack";
import { chest } from "./chest";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import quests from "../quests";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import { questProgressField } from "../../quest/questProgressField";
import { adjustGold } from "../../character/adjustGold";
import { awardXP } from "../../character/awardXP";
import { getCharacter } from "../../character/getCharacter";
import { getUserCharacter } from "../../character/getUserCharacter";
import { setGold } from "../../character/setGold";
import { getRandomMonster } from "../../monster/getRandomMonster";
import { createEncounter } from "../../encounter/createEncounter";
import { Monster } from "../../monster/Monster";
import { encounterInProgressEmbed } from "./encounterInProgressEmbed";
import { AttackResult } from "../../attack/AttackResult";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = getRandomMonster();
  let player = getUserCharacter(interaction.user);
  const encounter = createEncounter({ monster, player });
  let round = 0;
  let fled = false;
  let timeout = false;
  const playerAttacks = [];
  const monsterAttacks = [];
  const message = await interaction.reply({
    embeds: [encounterInProgressEmbed(encounter), attackExchangeEmbed()],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (monster.hp > 0 && player.hp > 0 && !fled && !timeout) {
    encounter.rounds++;
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
    const reaction = collected?.first();
    if (
      !collected ||
      timeout ||
      !reaction ||
      (reaction && reaction.emoji.name === "🏃‍♀️")
    ) {
      fled = true;
      encounter.outcome = "player fled";
    }

    const playerResult = fled ? undefined : attack(player.id, monster.id);
    const monsterResult = attack(monster.id, player.id);
    playerResult && playerAttacks.push(playerResult);
    monsterResult && monsterAttacks.push(monsterResult);
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
    message.edit({
      embeds: [
        encounterInProgressEmbed(encounter),
        attackExchangeEmbed({
          playerAttack: playerResult,
          monsterAttack: monsterResult,
        }),
      ],
    });
  }

  const summary = new MessageEmbed().setDescription(`Fight summary`);

  if (fled) {
    summary.addField("Fled", `You escaped with your life!`);
    encounter.outcome = "player fled";
  }
  if (monster.hp === 0 && player.hp > 0) {
    encounter.outcome = "player victory";
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
      encounter.outcome = "player defeated";
      setGold(player.id, 0);
      summary.addField("Looted", `You lost 💰${player.gold} gold!`);
    } else {
      encounter.outcome = "double ko";
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

  function attackExchangeEmbed(
    {
      playerAttack,
      monsterAttack,
    }: {
      playerAttack: AttackResult | void;
      monsterAttack: AttackResult | void;
    } = { playerAttack: undefined, monsterAttack: undefined }
  ): MessageEmbed {
    const embed = new MessageEmbed()
      .addField(
        `${monster.name}'s HP`,
        `${hpBar(
          monster,
          playerAttack && playerAttack.outcome === "hit"
            ? -playerAttack.damage
            : 0
        )}`
      )
      .addField(
        `${player.name}'s HP`,
        `${hpBar(
          player,
          monsterAttack && monsterAttack.outcome === "hit"
            ? -monsterAttack.damage
            : 0
        )}`
      );
    if (monsterAttack) embed.addField(...attackField(monsterAttack));
    if (playerAttack) {
      embed.addField(...attackField(playerAttack));
    }
    return embed;
  }
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
  new MessageEmbed()
    .setTitle(monster.name)
    .setDescription(monster.id)
    .setColor("RED")
    .setImage(monster.profile);
