import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustGold } from "../../character/adjustGold";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import { questProgressField } from "../../quest/questProgressField";
import { Monster } from "../../monster/Monster";
import { awardXP } from "../../character/awardXP";
import { Character } from "../../character/Character";
import { loot } from "../../character/loot/loot";

export function encounterSummary({
  fled,
  monster,
  player,
  interaction,
}: {
  fled: boolean;
  monster: Monster;
  player: Character;
  interaction: CommandInteraction;
}): MessageEmbed {
  const summary = new MessageEmbed({
    title: `Encounter summary`,
  });

  if (fled) {
    summary.addField("Fled", `You escaped with your life!`);
  }
  if (monster.hp === 0 && player.hp > 0) {
    summary.addField("Triumphant!", `You defeated the ${monster.name}! 🎉`);
    awardXP(player.id, monster.xpValue);
    summary.addField("XP Gained", monster.xpValue.toString());
    loot({ looterId: player.id, targetId: monster.id });
    summary.addField("GP Gained", ":gold: " + monster.gold.toString());
    if (player.quests.slayer) {
      const character = updateUserQuestProgess(interaction.user, "slayer", 1);
      if (character && character.quests.slayer)
        summary.addFields([questProgressField(character.quests.slayer)]);
    }
  }
  if (monster.hp > 0 && player.hp === 0) {
    summary.addField("Defeat!", `You were defeated by the ${monster.name}!`);
    awardXP(monster.id, player.xpValue);
    summary.addField("XP Gained", monster.xpValue.toString());
    adjustGold(player.id, monster.gold);
    loot({ looterId: monster.id, targetId: player.id });
    summary.addField("GP Looted", monster.gold.toString());
    // TODO: martyr quest
    // if (player.quests.martyr) {
    //   const character = updateUserQuestProgess(interaction.user, "martyr", 1);
    //   if (character && character.quests.martyr)
    //     summary.addFields([questProgressField(character.quests.martyr)]);
    // }
  }
  if (monster.hp === 0 && player.hp === 0) {
    summary.addField("Double Knockout!", "You were both knocked out!");
  }
  return summary;
}
