import { CommandInteraction, MessageEmbed } from "discord.js";
import inspect from "../../commands/inspect";
import { getUserCharacter } from "../../gameState";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { Quest } from "../Quest";
import { removeQuest } from "./removeQuest";

export async function buffQuestReward(
  interaction: CommandInteraction,
  effect: StatusEffect,
  quest: Quest
): Promise<void> {
  const character = getUserCharacter(interaction.user);
  const embeds = [
    new MessageEmbed({
      title: `Survivor Quest Complete!`,
      description: "You have survived hardship and it only makes you harder.",
    }),
  ];

  updateStatusEffect(character.id, effect);

  removeQuest({ user: interaction.user, questId: quest.id });

  await interaction.followUp({
    fetchReply: true,
    embeds,
  });

  await inspect.execute(interaction, "followUp");
}
