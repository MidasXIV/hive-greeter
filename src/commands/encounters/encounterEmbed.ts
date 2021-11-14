import { MessageEmbed } from "discord.js";
import { getCharacter } from "../../character/getCharacter";
import { Encounter } from "../../monster/Encounter";
import { getMonster } from "../../character/getMonster";

export const encounterEmbed = (encounter: Encounter) => {
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
    title: `${character.name} encountered ${monster.name}`,
    fields: [
      {
        name: "Result",
        value: encounter.result ?? "unknown",
        inline: true,
      },
      {
        name: "Result",
        value: encounter.result ?? "unknown",
        inline: true,
      },
      {
        name: "Rounds",
        value: encounter.rounds.toString(),
        inline: true,
      },
    ],
    timestamp: encounter.date,
  }).setThumbnail(monster.profile);
};
