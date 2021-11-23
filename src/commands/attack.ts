import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { playerAttack } from "../attack/playerAttack";
import { sleep } from "../utils";
import { cooldownRemainingText } from "../character/cooldownRemainingText";
import { mentionCharacter } from "../character/mentionCharacter";
import { attack } from "../attack/attack";
import { hpBarField } from "../character/hpBar/hpBarField";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";

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
  let lootResult;
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
  const embeds = [];
  embeds.push(
    attackResultEmbed(result).setTitle(
      `${attacker.name} attacks ${defender.name}!`
    )
  );
  if (result.defender.hp === 0) {
    lootResult = loot({ looterId: attacker.id, targetId: defender.id });
    if (lootResult) embeds.push(lootResultEmbed(lootResult));
  }
  await interaction.reply({
    embeds,
  });
  await sleep(2000);
  const retaliationEmbeds: MessageEmbed[] = [];
  if (result.defender.hp > 0) {
    const result = attack(defender.id, attacker.id);
    if (!result || result.outcome === "cooldown")
      // TODO: cooldown shouldn't be a possible outcome here
      return await interaction.reply(
        `No attack result or retaliation outcome is cooldown. This should not happen.`
      );
    retaliationEmbeds.push(
      attackResultEmbed(result).setTitle(
        `${defender.name} retaliates against ${attacker.name}!`
      )
    );
    if (result.defender.hp === 0) {
      lootResult = loot({ looterId: defender.id, targetId: attacker.id });
      if (lootResult) retaliationEmbeds.push(lootResultEmbed(lootResult));
    }

    await interaction.followUp({
      embeds: retaliationEmbeds,
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
      : `${result.defender.hp}/${getCharacterStatModified(
          result.defender,
          "maxHP"
        )} ${result.defender.hp <= 0 ? "(unconscious)" : ""}`
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
      embed.setImage(
        "https://i.pinimg.com/564x/10/5e/9e/105e9ea5f0d2e86bde9e7a365289a9cc.jpg"
      );
      break;
  }

  embed.addFields([
    hpBarField(result.defender),
    {
      name: `Attack`,
      value: attackRollText(result),
    },
  ]);

  if (result.damage)
    embed.addField("Damage", "🩸 " + result.damage.toString(), true); // TODO: damageRollText

  return embed;
};
