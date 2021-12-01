import { randomUUID } from "crypto";
import { CommandInteraction } from "discord.js";
import { Shrine } from "../../shrines/Shrine";
import { shrineEmbeds } from "./shrineEmbeds";
import { applyShrine } from "./applyShrine";

export const slayerShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: "Slayer's Shrine",
    description: `This shrine fills you with an instinct for blood!`,
    image:
      "https://i.pinimg.com/originals/6a/37/34/6a3734feeec0937b71b80eb646da00c7.png",
    color: "GREY",
    effect: {
      name: "Slayer's Shrine",
      buff: true,
      debuff: false,
      modifiers: {
        monsterDamageMax: 3,
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
