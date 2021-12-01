import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { questProgressField } from "../../quest/questProgressField";
import { Shrine } from "../../shrines/Shrine";
import { statusEffectEmbed } from "../../statusEffects/statusEffectEmbed";

export function shrineEmbeds({
  shrine,
  interaction,
}: {
  shrine: Shrine;
  interaction: CommandInteraction;
}): MessageEmbed[] {
  const character = getUserCharacter(interaction.user);
  const quest = character.quests.blessed;
  return [
    new MessageEmbed({
      title: `${character.name} encounters a ${shrine.name}`,
      description: shrine.description,
      fields: quest ? [questProgressField(quest)] : [],
      color: shrine.color,
    }).setImage(shrine.image),
    statusEffectEmbed(shrine.effect, interaction),
  ];
}
