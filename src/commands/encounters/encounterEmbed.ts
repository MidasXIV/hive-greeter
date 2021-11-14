import { MessageEmbed } from "discord.js";
import { getCharacter } from "../../character/getCharacter";
import { Encounter } from "../../monster/Encounter";
import { getMonster } from "../../character/getMonster";
import { hpBarField } from "../../character/hpBar/hpBarField";
import { getCharacterStatModified } from "../../character/getCharacterStatModified";
import { progressBar } from "../../utils/progress-bar";
import { AttackResult } from "../../attack/AttackResult";
import { Character } from "../../character/Character";
import { Monster } from "../../monster/Monster";

// given a bonus to your roll, what are the chances of rolling above a target?
const chanceToHit = ({ bonus, dc }: { bonus: number; dc: number }): number =>
  (21 - dc - bonus) / 20; // https://rpg.stackexchange.com/a/70349

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
        name: "Monster accuracy",
        value: `Hit chance ${hitChanceText(character, monster)}
          ${accuracyBar(encounter.monsterAttacks)}`,
      },
      {
        name: "Player accuracy",
        value: accuracyBar(encounter.playerAttacks),
      },
      hpBarField(monster),
      hpBarField(character),
    ],
    timestamp: encounter.date,
  }).setThumbnail(monster.profile);
};

const averageRoll = (attacks: AttackResult[]) =>
  attacks.reduce(
    (total, attack) =>
      total + (attack.outcome !== "cooldown" ? attack.attackRoll : 0),
    0
  ) / attacks.length;

const accuracyBar = (attacks: AttackResult[]) =>
  `${progressBar(averageRoll(attacks) / 20, 10)} 
  Average Roll: ${averageRoll(attacks).toFixed(2).toString()}`;

function hitChanceText(monster: Character, character: Character): string {
  return (
    (
      100 *
      chanceToHit({
        bonus: getCharacterStatModified(monster, "attackBonus"),
        dc: getCharacterStatModified(character, "ac"),
      })
    ).toString() + "%"
  );
}
