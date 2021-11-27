import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import inspect from "../../commands/inspect/inspect";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";
import { removeQuest } from "./removeQuest";

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const quest = character.quests.healer;
  if (!quest) {
    console.error(`healerQuestReward with no quest`);
    await interaction.followUp(
      `ERROR: healerQuestReward with no quest for ${character.name} (${character.id})`
    );
    return;
  }
  const embeds = [
    new MessageEmbed({
      title: `${quest.title} Quest Complete!`,
      description: quest.victoryText,
    }),
  ];
  updateStatusEffect(interaction.user.id, {
    name: "Healer",
    buff: true,
    debuff: false,
    duration: 24 * 60 * 60000,
    modifiers: {},
    started: new Date().toString(),
  });

  removeQuest({ user: interaction.user, questId: "healer" });

  await interaction.followUp({
    embeds,
  });
  await inspect.execute(interaction, "followUp");
};
