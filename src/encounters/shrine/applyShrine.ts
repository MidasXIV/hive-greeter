import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import {
  hasStatusEffect,
  updateStatusEffect,
} from "../../statusEffects/grantStatusEffect";
import quests from "../../commands/quests";
import { Shrine } from "../../shrines/Shrine";

export async function applyShrine({
  interaction,
  shrine,
}: {
  interaction: CommandInteraction;
  shrine: Shrine;
}): Promise<void> {
  const effect = shrine.effect;
  if (hasStatusEffect(getUserCharacter(interaction.user), "Blessed")) {
    effect.duration *= 2;
  }
  updateStatusEffect(interaction.user.id, effect);
  updateUserQuestProgess(interaction.user, "blessed", 1);
  if (isUserQuestComplete(interaction.user, "blessed"))
    await quests.execute(interaction);
}
