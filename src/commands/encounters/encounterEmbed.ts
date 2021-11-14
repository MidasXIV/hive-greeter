import { MessageEmbed } from "discord.js";
import { getCharacter } from "../../character/getCharacter";
import { Encounter } from "../../monster/Encounter";
import { getMonster } from "../../character/getMonster";

export const encounterEmbed = (encounter: Encounter): MessageEmbed => {
  const character = getCharacter(encounter.characterId);
  const monster = getMonster(encounter.monsterId);
  if (!character)
    return new MessageEmbed({
      title: `Character ${encounter.characterId} not found`,
    });
  if (!monster)
    return new MessageEmbed({
      title: `Monster ${encounter.monsterId} not found`,
    });
  return new MessageEmbed({
    title: `Encounter: ${character.name} vs ${monster.name}`,
    fields: [
      {
        name: "Status",
        value: encounter.outcome ?? "unknown",
        inline: true,
      },
      {
        name: "Rounds",
        value: encounter.rounds.toString(),
        inline: true,
      },
      // {
      //   name: "Monster accuracy",
      //   value: accuracyText(character, monster, encounter.monsterAttacks),
      // },
      // {
      //   name: "Player accuracy",
      //   value: `Hit chance ${hitChanceText(character, monster)}
      //     ${accuracyBar(encounter.monsterAttacks)}`,
      // },
      // hpBarField(monster),
      // hpBarField(character),
    ],
    timestamp: encounter.date,
  })
    .setColor("RED")
    .setImage(monster.profile)
    .setThumbnail(character.profile);
};
