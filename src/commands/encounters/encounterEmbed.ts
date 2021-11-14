import { MessageEmbed } from "discord.js";
import { getCharacter } from "../../character/getCharacter";
import { Encounter } from "../../monster/Encounter";
import { getMonster } from "../../character/getMonster";
import { hpBarField } from "../../character/hpBar/hpBarField";

export const encounterCard = (encounter: Encounter): MessageEmbed => {
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
        value: encounter.status ?? "unknown",
        inline: true,
      },
      {
        name: "Rounds",
        value: encounter.rounds.toString(),
        inline: true,
      },
      {
        name: "Total Monster Damage Dealt",
        value: encounter.monsterAttacks
          .reduce(
            (total, attack) =>
              total + (attack.outcome === "hit" ? attack.damage : 0),
            0
          )
          .toString(),
      },
      hpBarField(monster),
      hpBarField(character),
    ],
    timestamp: encounter.date,
  }).setThumbnail(monster.profile);
};
