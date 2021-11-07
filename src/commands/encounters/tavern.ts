import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { adjustHP, d6, awardXP } from "../../gameState";
import { sleep } from "../../utils";

export const tavern = async (
  interaction: CommandInteraction
): Promise<void> => {
  const message = await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Tavern")
        .setColor("#964B00")
        .setDescription(
          `You find a tavern and hope for a soft bed, warm meal, and strong drink...`
        )
        .setImage("https://i.imgur.com/AbNnc7S.png"),
    ],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  await sleep(2000);

  if (Math.random() > 0.5) {
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
  } else {
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
};
