import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustHP } from "../../character/adjustHP";
import { awardXP } from "../../character/awardXP";
import { getUserCharacter } from "../../character/getUserCharacter";
import { hpBarField } from "../../character/hpBar/hpBarField";
import { d6 } from "../../gameState";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { statusEffectEmbed } from "../../commands/statusEffectEmbed";
import { xpGainField } from "../../character/xpGainField";

export async function restfulNight(
  interaction: CommandInteraction
): Promise<void> {
  const healAmount = d6();
  awardXP(interaction.user.id, 1);
  adjustHP(interaction.user.id, healAmount);
  const character = getUserCharacter(interaction.user);
  const buff: StatusEffect = {
    name: "Restful Night",
    buff: true,
    debuff: false,
    duration: 30 * 60000,
    started: new Date().toString(),
    modifiers: {
      maxHP: 2,
    },
  };
  updateStatusEffect(character.id, buff);
  await interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: "Restful Night",
        color: "DARK_NAVY",
        description: "You feel well rested. 💤",
        fields: [
          hpBarField(getUserCharacter(interaction.user), healAmount),
          xpGainField(interaction, 1),
        ],
      }).setImage("https://i.imgur.com/5FAD82X.png"),
      statusEffectEmbed(buff),
    ],
  });
}
