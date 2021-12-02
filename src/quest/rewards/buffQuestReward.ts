import { CommandInteraction, MessageEmbed } from "discord.js";
import inspect from "../../commands/inspect/inspect";
import { getUserCharacter } from "../../character/getUserCharacter";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { Quest } from "../Quest";
import { questCompleted } from "../../store/slices/characters";
import store from "../../store";

export async function buffQuestReward(
  interaction: CommandInteraction,
  effect: StatusEffect,
  quest: Quest
): Promise<void> {
  const character = getUserCharacter(interaction.user);
  const embeds = [
    new MessageEmbed({
      title: `${quest.title} Complete!`,
      description: quest.victoryText,
    }),
  ];

  updateStatusEffect(character.id, effect);
  store.dispatch(
    questCompleted({ questId: quest.id, characterId: interaction.user.id })
  );

  await interaction.followUp({
    fetchReply: true,
    embeds,
  });

  await inspect.execute(interaction, "followUp");
}
