import { randomUUID } from "crypto";
import { CommandInteraction } from "discord.js";
import { Shrine } from "../../shrines/Shrine";
import { shrineEmbeds } from "./shrineEmbeds";
import { applyShrine } from "./applyShrine";

export const attackShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: "Shrine of Agression",
    description: `This shrine fills you with a rage!`,
    image: "https://i.imgur.com/7qVghXO.png",
    color: "RED",
    effect: {
      name: "Shrine of Agression",
      buff: true,
      debuff: false,
      modifiers: {
        attackBonus: 2,
      },
      duration: 30 * 60000,
      started: new Date().toString(),
    },
  };

  applyShrine({ shrine, interaction });

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  });
};
