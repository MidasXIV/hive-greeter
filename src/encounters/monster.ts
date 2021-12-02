import { CommandInteraction, Message } from "discord.js";
import { attack } from "../attack/attack";
import { chest } from "./chest";
import { isUserQuestComplete } from "../quest/isQuestComplete";
import quests from "../commands/quests";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { getCharacter } from "../character/getCharacter";
import { getUserCharacter } from "../character/getUserCharacter";
import { getRandomMonster } from "../monster/getRandomMonster";
import { createEncounter } from "../encounter/createEncounter";
import { Monster } from "../monster/Monster";
import { encounterInProgressEmbed } from "./encounterInProgressEmbed";
import { adjustHP } from "../character/adjustHP";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import store from "../store";
import { addMonsterAttack, addPlayerAttack } from "../store/slices/encounters";
import { Emoji } from "../Emoji";
import { attackResultEmbed } from "../encounter/attackResultEmbed";
import { encounterSummaryEmbed } from "../encounter/encounterSummaryEmbed";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = await getRandomMonster();
  let player = getUserCharacter(interaction.user);

  console.log("monster encounter", monster, player);
  const encounter = createEncounter({ monster, player });
  let timeout = false;
  const message = await interaction.editReply({
    embeds: [encounterInProgressEmbed(encounter)],
  });
  if (!(message instanceof Message)) return;

  while (encounter.outcome === "in progress") {
    encounter.rounds++;
    const attackEmoji = Emoji(interaction, "attack");
    const runEmoji = Emoji(interaction, "run");
    await message.react(attackEmoji);
    await message.react(runEmoji);
    const collected = await message
      .awaitReactions({
        filter: (reaction, user) =>
          [attackEmoji, "attack", runEmoji, "run"].includes(
            reaction.emoji.name ?? ""
          ) && user.id === interaction.user.id,
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
      [runEmoji, "run"].includes(reaction.emoji.name ?? "")
    ) {
      encounter.outcome = "player fled";
    }

    const playerResult =
      encounter.outcome == "player fled"
        ? undefined
        : attack(player.id, monster.id);
    const monsterResult = attack(monster.id, player.id);
    playerResult &&
      store.dispatch(addPlayerAttack({ encounter, result: playerResult }));
    monsterResult &&
      store.dispatch(addMonsterAttack({ encounter, result: monsterResult }));
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
      embeds: [encounterInProgressEmbed(encounter)]
        .concat(
          playerResult
            ? attackResultEmbed({ result: playerResult, interaction })
            : []
        )
        .concat(
          monsterResult
            ? attackResultEmbed({ result: monsterResult, interaction })
            : []
        ),
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
    await chest(interaction);
  if (
    isUserQuestComplete(interaction.user, "slayer") ||
    isUserQuestComplete(interaction.user, "survivor")
  )
    await quests.execute(interaction);
};
