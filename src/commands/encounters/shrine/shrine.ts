import { CommandInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import { getUserCharacter, updateCharacter } from "../../../gameState";
import { addQuestProgress } from "../../../quest/addQuestProgress";
import { questProgressField } from "../../../quest/questProgressField";
import { grantStatusEffect } from "../../../status-effets/grantStatusEffect";
import { StatusEffect } from "../../../status-effets/StatusEffect";

export const shrine = async (
  interaction: CommandInteraction,
  effect: StatusEffect,
  embed: MessageEmbed
): Promise<void> => {
  updateCharacter(
    addQuestProgress(getUserCharacter(interaction.user), "blessed", 1)
  );
  grantStatusEffect(interaction.user.id, effect);
  embed.addField(
    "Expires",
    moment(new Date(effect.started)).add(effect.duration).fromNow()
  );
  embed.setTitle(effect.name);
  const quest = getUserCharacter(interaction.user).quests.blessed;
  if (quest) embed.addFields([questProgressField(quest)]);
  await interaction.reply({
    embeds: [embed],
  });
};
