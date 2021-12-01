import { randomUUID } from "crypto";
import { CommandInteraction } from "discord.js";
import { Shrine } from "../../shrines/Shrine";
import { shrineEmbeds } from "./shrineEmbeds";
import { applyShrine } from "./applyShrine";

export const vigorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: "Vigor Shrine",
    description: `The shrine fills you with renewed vigor.`,
    image:
      "https://i.pinimg.com/originals/c1/4e/f0/c14ef0766793f8c967f6d685f29d52d6.jpg",
    color: "WHITE",
    effect: {
      name: "Shrine of Vigor",
      buff: true,
      debuff: false,
      modifiers: {
        maxHP: 3,
      },
      duration: 30 * 60000,
      started: new Date().toString(),
    },
  };

  applyShrine({ shrine, interaction });

  interaction.reply({
    embeds: shrineEmbeds({ shrine, interaction }),
  });
};
