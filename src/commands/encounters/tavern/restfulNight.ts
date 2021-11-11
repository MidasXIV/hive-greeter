import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustHP, d6, awardXP } from "../../../gameState";

export async function restfulNight(
  interaction: CommandInteraction
): Promise<void> {
  const roll = d6();
  awardXP(interaction.user.id, 1);
  adjustHP(interaction.user.id, roll);
  await interaction.followUp({
    embeds: [
      new MessageEmbed()
        .setTitle("Restful Night")
        .setColor("DARK_NAVY")
        .setDescription("You feel well rested. 💤")
        .addField("HP Gained", roll.toString())
        .addField("XP Gained", "1")
        .setImage("https://i.imgur.com/5FAD82X.png"),
    ],
  });
}
