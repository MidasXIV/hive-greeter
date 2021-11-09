import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import { adjustHP, awardXP, d6 } from "../../../gameState";

export const chattyTavernkeepers = async (
  interaction: CommandInteraction
): Promise<void> => {
  const roll = d6();
  awardXP(interaction.user.id, 1);
  adjustHP(interaction.user.id, roll);
  const message = await interaction.reply({
    fetchReply: true,
    files: [new MessageAttachment("./images/Tavernkeepers.jpg")],
    embeds: [
      new MessageEmbed()
        .setTitle("Chatty Tavernkeepers!")
        .setImage("attachment://Tavernkeepers.jpg")
        .setDescription(
          "Turns out they know someone's got a thing needs doing.\n\nCompensation? Of course!"
        ),
    ],
    components: [
      new MessageActionRow({
        components: [
          new MessageSelectMenu()
            .setCustomId("quest")
            .setPlaceholder("So... you in or what?")
            .addOptions([
              {
                label: "Defeat 10 monsters",
                value: "slayer",
                description: "Gain a powerful weapon",
              },
            ])
            .addOptions([
              {
                label: "Defeat 10 monsters",
                value: "slayer",
                description: "Gain a powerful weapon",
              },
            ]),
        ],
      }),
    ],
  });

  if (!(message instanceof Message)) return;
};
