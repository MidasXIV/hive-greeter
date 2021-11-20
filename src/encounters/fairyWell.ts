import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustHP } from "../character/adjustHP";
import { awardXP } from "../character/awardXP";
import { getUserCharacter } from "../character/getUserCharacter";
import { hpBarField } from "../character/hpBar/hpBarField";
import { questProgressField } from "../character/hpBar/hpField";
import { xpGainField } from "../character/xpGainField";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";

export const fairyWell = async (
  interaction: CommandInteraction
): Promise<void> => {
  const healAmount = Math.ceil(Math.random() * 6);
  adjustHP(interaction.user.id, healAmount);
  awardXP(interaction.user.id, 1);
  updateUserQuestProgess(interaction.user, "healer", healAmount);

  const character = getUserCharacter(interaction.user);
  await interaction.reply({
    embeds: [
      new MessageEmbed({
        title: "Fairy Well",
        color: "DARK_VIVID_PINK",
        description: `You drink from a fairy's well, it heals you for ${healAmount}!`,
        fields: [
          xpGainField(interaction, 1),
          hpBarField(character, healAmount),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage("https://imgur.com/bgq63v9.png"),
    ],
  });
};
