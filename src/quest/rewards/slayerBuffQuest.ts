import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../../gameState";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";

export const slayerBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const embeds = [
    new MessageEmbed({
      title: `Slayer Quest Complete!`,
      description: "Your prowess is unmatched!",
    }),
  ];
  updateStatusEffect(character.id, {
    name: "Slayer",
    buff: true,
    debuff: false,
    duration: 4 * 60 * 60000,
    modifiers: {
      monsterDamageMax: 6,
    },
    started: new Date().toString(),
  });
  await interaction.followUp({
    embeds,
  });
};
