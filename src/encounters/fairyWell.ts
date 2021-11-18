import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustHP } from "../character/adjustHP";
import { awardXP } from "../character/awardXP";
import { getUserCharacter } from "../character/getUserCharacter";
import { hpBarField } from "../character/hpBar/hpBarField";
import { xpGainField } from "../character/xpGainField";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";

export const fairyWell = async (
  interaction: CommandInteraction
): Promise<void> => {
  const healAmount = Math.ceil(Math.random() * 6);
  adjustHP(interaction.user.id, healAmount);
  awardXP(interaction.user.id, 1);
  updateUserQuestProgess(interaction.user, "healer", healAmount);

  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Fairy Well")
        .setColor("DARK_VIVID_PINK")
        .setDescription(
          `You drink from a fairy's well, it heals you for ${healAmount}!`
        )
        .addFields([
          xpGainField(interaction, 1),
          hpBarField(getUserCharacter(interaction.user), healAmount),
        ])
        .setImage("https://imgur.com/bgq63v9.png"),
    ],
  });
};
