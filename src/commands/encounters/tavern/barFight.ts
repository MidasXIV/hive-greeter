import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustHP, d6, awardXP } from "../../../gameState";

export async function barFight(interaction: CommandInteraction): Promise<void> {
  const roll = d6();
  awardXP(interaction.user.id, 1);
  adjustHP(interaction.user.id, -roll);
  await interaction.followUp({
    embeds: [
      new MessageEmbed()
        .setTitle("Bar Fight!")
        .setColor("RED")
        .setDescription("You get into a drunken brawl and are kicked out.")
        .addField("HP Lost", roll.toString())
        .addField("XP Gained", "1")
        .setImage("https://i.imgur.com/yo1JymD.png"),
    ],
  });
}
