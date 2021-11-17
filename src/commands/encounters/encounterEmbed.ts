import { MessageEmbed } from "discord.js";
import { getCharacter } from "../../character/getCharacter";
import { Encounter } from "../../monster/Encounter";
import { getMonster } from "../../character/getMonster";
import { decoratedName } from "../../character/decoratedName";
import { accuracyText } from "./accuracyText";

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
  const embed = new MessageEmbed({
    title: `Encounter: ${decoratedName(character)} vs ${decoratedName(
      monster
    )}`,
    fields: [
      {
        name: "Outcome",
        value: encounter.outcome ?? "unknown",
        inline: true,
      },
      {
        name: "Rounds",
        value: encounter.rounds.toString(),
        inline: true,
      },
      {
        name: "Monster accuracy",
        value: accuracyText({
          attacker: monster,
          defender: character,
          attacks: encounter.monsterAttacks,
        }),
      },
      {
        name: "Player accuracy",
        value: accuracyText({
          attacker: character,
          defender: monster,
          attacks: encounter.playerAttacks,
        }),
      },
    ],
    timestamp: encounter.date,
  })
    .setColor("RED")
    .setImage(monster.profile)
    .setThumbnail(character.profile);
  if (encounter.goldLooted)
    embed.addField("Gold Looted", "💰 " + encounter.goldLooted.toString());
  return embed;
};
