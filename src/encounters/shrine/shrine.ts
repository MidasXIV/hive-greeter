import { CommandInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import { getUserCharacter } from "../../character/getUserCharacter";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import { questProgressField } from "../../quest/questProgressField";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import {
  hasStatusEffect,
  updateStatusEffect,
} from "../../statusEffects/grantStatusEffect";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import quests from "../../commands/quests";

export const shrine = async (
  interaction: CommandInteraction,
  effect: StatusEffect,
  embed: MessageEmbed
): Promise<void> => {
  if (hasStatusEffect(getUserCharacter(interaction.user), "Blessed")) {
    effect.duration *= 2;
  }
  updateStatusEffect(interaction.user.id, effect);
  updateUserQuestProgess(interaction.user, "blessed", 1);
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
  if (isUserQuestComplete(interaction.user, "blessed"))
    await quests.execute(interaction, "followUp");
};
