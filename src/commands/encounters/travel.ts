import { CommandInteraction, MessageEmbed } from "discord.js";
import { awardXP, getUserCharacter, updateCharacter } from "../../gameState";
import { addQuestProgress } from "../../quest/addQuestProgress";

export const travel = async (
  interaction: CommandInteraction
): Promise<void> => {
  awardXP(interaction.user.id, 1);
  updateCharacter(
    addQuestProgress(getUserCharacter(interaction.user), "traveler", 1)
  );
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Travel")
        .setColor("GREEN")
        .setDescription(`You travel the lands.`)
        .addField("XP Gained", "1")
        .setImage("https://imgur.com/WCVVyh6.png"),
    ],
  });
};
