import { CommandInteraction, MessageEmbed } from "discord.js";
import { awardXP } from "../character/awardXP";
import { xpGainField } from "../character/xpGainField";

export const travel = async (
  interaction: CommandInteraction
): Promise<void> => {
  awardXP(interaction.user.id, 1);
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: "Travel",
        color: "GREEN",
        fields: [xpGainField(interaction, 1)],
        description: `You travel the lands.`,
      }).setImage("https://imgur.com/WCVVyh6.png"),
    ],
  });
};
