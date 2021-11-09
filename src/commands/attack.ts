import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustGold, getUserCharacter, setGold } from "../gameState";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { playerAttack } from "../attack/playerAttack";
import { cooldownRemainingText, sleep } from "../utils";
import { mentionCharacter } from "../character/mentionCharacter";
import { hpBar } from "../utils/hp-bar";
import { attack } from "../attack/attack";

export const command = new SlashCommandBuilder()
  .setName("attack")
  .setDescription("Make an attack")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to attack").setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const target = interaction.options.data[0].user;
  const initiator = interaction.user;
  if (!target) {
    await interaction.reply(`You must specify a target @player`);
    return;
  }

  const attacker = getUserCharacter(initiator);
  const defender = getUserCharacter(target);
  if (attacker.hp === 0) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`You're too weak to press on.`)
          .setImage("https://imgur.com/uD06Okr.png"),
      ],
    });
    return;
  }
  const result = playerAttack(attacker.id, defender.id);
  if (!result)
    return await interaction.reply(`No attack result. This should not happen.`);

  if (result.outcome === "cooldown")
    return await interaction.reply(
      `You can attack again ${cooldownRemainingText(
        interaction.user.id,
        "attack"
      )}.`
    );
  const embed = attackResultEmbed(result).setTitle(
    `${attacker.name}'s Attack!`
  );
  if (result.defender.hp === 0 && defender.gold) {
    adjustGold(attacker.id, defender.gold);
    setGold(defender.id, 0);
    embed.addField(
      "Loot!",
      `${mentionCharacter(attacker)} takes 💰${
        defender.gold
      } from  ${mentionCharacter(result.defender)}`
    );
  }
  await interaction.reply({ embeds: [embed] });
  await sleep(2000);
  if (result.defender.hp > 0) {
    const result = attack(defender.id, attacker.id);
    if (!result || result.outcome === "cooldown") return; // TODO: cooldown shouldn't be a possible outcome here
    const embed = attackResultEmbed(result).setTitle(
      `${defender.name}'s Retaliation!`
    );
    if (result.defender.hp === 0 && defender.gold) {
      adjustGold(result.attacker.id, result.defender.gold);
      setGold(result.defender.id, 0);
      embed.addField(
        "Loot!",
        `${mentionCharacter(result.attacker)} takes 💰${
          defender.gold
        } from  ${mentionCharacter(result.defender)}`
      );
    }

    await interaction.followUp({
      embeds: [embed],
    });
  }
};

export default { command, execute };

const accuracyDescriptor = (result: ReturnType<typeof playerAttack>) => {
  if (!result) return `No result`;
  if (result.outcome === "cooldown") return "On cooldown";
  const accuracy =
    result.attackRoll +
    getCharacterStatModified(result.attacker, "attackBonus") -
    getCharacterStatModified(result.defender, "ac");
  const attacker = mentionCharacter(result.attacker);
  const defender = mentionCharacter(result.defender);
  switch (true) {
    case accuracy >= 5:
      return (
        result.attacker.equipment.weapon?.accuracyDescriptors.veryAccurate[0]
          .replace(/<@attacker>/g, attacker)
          .replace(/<@defender>/g, defender) ??
        `${attacker} strikes ${defender} true`
      );
    case accuracy >= 2:
      return (
        result.attacker.equipment.weapon?.accuracyDescriptors.onTheNose[0]
          .replace(/<@attacker>/g, attacker)
          .replace(/<@defender>/g, defender) ??
        `${attacker} finds purchase against ${defender}`
      );
    case accuracy >= 1:
      return (
        result.attacker.equipment.weapon?.accuracyDescriptors.onTheNose[0]
          .replace(/<@attacker>/g, attacker)
          .replace(/<@defender>/g, defender) ??
        `${attacker} narrowly hits ${defender}`
      );
    case accuracy === 0:
      return (
        result.attacker.equipment.weapon?.accuracyDescriptors.onTheNose[0]
          .replace(/<@attacker>/g, attacker)
          .replace(/<@defender>/g, defender) ??
        `${attacker} barely hits ${defender}`
      );
    case accuracy <= 1:
      return (
        result.attacker.equipment.weapon?.accuracyDescriptors.nearMiss[0]
          .replace(/<@attacker>/g, attacker)
          .replace(/<@defender>/g, defender) ??
        `${attacker} narrowly misses ${defender}`
      );
    case accuracy <= 2:
      return (
        result.attacker.equipment.weapon?.accuracyDescriptors.nearMiss[0]
          .replace(/<@attacker>/g, attacker)
          .replace(/<@defender>/g, defender) ?? `${attacker} misses ${defender}`
      );
    case accuracy < 5:
      return (
        result.attacker.equipment.weapon?.accuracyDescriptors.wideMiss[0]
          .replace(/<@attacker>/g, attacker)
          .replace(/<@defender>/g, defender) ??
        `${attacker} misses ${defender} utterly`
      );
  }
};

const damageDescriptor = (result: ReturnType<typeof playerAttack>) => {
  if (!result) return `No result`;
  if (result.outcome === "cooldown") return "";
  const damage = result.damage;
  switch (true) {
    case damage > 5:
      return "with a devastating blow!";
    case damage > 2:
      return "with a solid strike.";
    default:
      return "with a weak hit.";
  }
};

export const attackFlavorText = (
  result: ReturnType<typeof playerAttack>
): string =>
  result
    ? `${accuracyDescriptor(result)} ${damageDescriptor(result)}`
    : "No result";

export const hpText = (result: ReturnType<typeof playerAttack>): string =>
  result
    ? result.outcome === "cooldown"
      ? "on cooldown"
      : `${result.defender.hp}/${result.defender.maxHP} ${
          result.defender.hp <= 0 ? "(unconscious)" : ""
        }`
    : "No result";

export const attackRollText = (
  result: ReturnType<typeof playerAttack>
): string => {
  if (!result) return "No result. This should not happen.";
  if (result.outcome === "cooldown") return "on cooldown";
  const ac = result.defender.ac;
  const acModifier = getCharacterStatModifier(result.defender, "ac");
  const roll = result.attackRoll;
  const attackBonus = getCharacterStatModified(result.attacker, "attackBonus");
  const totalAttack = roll + attackBonus;
  const totalAc = ac + acModifier;

  const acModifierText =
    acModifier > 0 ? `+${acModifier}` : acModifier < 0 ? `-${acModifier}` : ``;

  const comparison = result.outcome === "hit" ? "≥" : "<";
  const outcome = result.outcome === "hit" ? "Hit!" : "Miss.";

  return `${outcome}\n⚔${totalAttack} ${comparison} 🛡${totalAc} (\`${roll}\`+${attackBonus} vs ${ac}${acModifierText})`;
};

const attackResultEmbed = (
  result: ReturnType<typeof playerAttack>
): MessageEmbed => {
  const embed = new MessageEmbed().setDescription(attackFlavorText(result));
  if (!result || result.outcome === "cooldown") return embed;

  switch (result.outcome) {
    case "hit":
      embed.setImage("https://i.imgur.com/rM6yWps.png");
      break;
    case "miss":
    default:
      embed.setImage("https://i.imgur.com/xVlTNQm.png");
      break;
  }

  embed.addFields([
    {
      name: `${result.defender.name}'s HP`,
      value: hpText(result) + `\n${hpBar(result.defender, -result.damage)}`,
    },
    {
      name: `Attack`,
      value: attackRollText(result),
    },
  ]);

  if (result.damage)
    embed.addField("Damage", "🩸 " + result.damage.toString(), true); // TODO: damageRollText

  return embed;
};
