import { CommandInteraction, MessageEmbed } from "discord.js";
import { d6 } from "../../../gameState";
import { adjustHP } from "../../../adjustHP";
import { awardXP } from "../../../awardXP";
import { getUserCharacter } from "../../../getUserCharacter";
import { questProgressField } from "../../../quest/questProgressField";
import { updateUserQuestProgess } from "../../../quest/updateQuestProgess";

export async function barFight(interaction: CommandInteraction): Promise<void> {
  const damage = d6();
  awardXP(interaction.user.id, 1);
  adjustHP(interaction.user.id, -damage);
  const embed = new MessageEmbed()
    .setTitle("Bar Fight!")
    .setColor("RED")
    .setDescription("You get into a drunken brawl and are kicked out.")
    .addField("HP Lost", damage.toString())
    .addField("XP Gained", "1")
    .setImage("https://i.imgur.com/yo1JymD.png");
  const character = getUserCharacter(interaction.user);
  if (character.hp > 0 && character.quests.survivor) {
    const updated = updateUserQuestProgess(
      interaction.user,
      "survivor",
      damage
    );
    if (updated && updated.quests.survivor)
      embed.addFields([questProgressField(updated.quests.survivor)]);
  }

  await interaction.followUp({
    embeds: [embed],
  });
}
