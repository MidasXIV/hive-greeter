import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import {
  attackPlayer,
  getCharacterStatModified,
  getCharacterStatModifier,
  getUserCharacter,
} from "../db";
import { cooldownRemainingText, mentionCharacter } from "../utils";

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
  const result = attackPlayer(attacker.id, defender.id);
  await showAttackResult(result, interaction);
};

export default { command, execute };
const showAttackResult = async (
  result: ReturnType<typeof attackPlayer>,
  interaction: CommandInteraction
): Promise<void> => {
  if (!result) return await interaction.reply(`No attack result.`);

  // TODO: move this into attackResultEmbed
  switch (result.outcome) {
    case "cooldown":
      await interaction.reply(
        `You can attack again ${cooldownRemainingText(
          interaction.user.id,
          "attack"
        )}.`
      );
      return;
  }
  await interaction.reply({ embeds: [attackResultEmbed(result)] });
};

const accuracyDescriptor = (result: ReturnType<typeof attackPlayer>) => {
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
      return `${attacker} strikes ${defender} true`;
    case accuracy >= 2:
      return `${attacker} finds purchase against ${defender}`;
    case accuracy >= 1:
      return `${attacker} narrowly hits ${defender}`;
    case accuracy === 0:
      return `${attacker} barely hits ${defender}`;
    case accuracy <= 1:
      return `${attacker} narrowly misses ${defender}`;
    case accuracy <= 2:
      return `${attacker} misses ${defender}`;
    case accuracy < 5:
      return `${attacker} misses ${defender} utterly`;
  }
};

const damageDescriptor = (result: ReturnType<typeof attackPlayer>) => {
  if (!result) return `No result`;
  if (result.outcome !== "hit") return "with a wide swing";
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
  result: ReturnType<typeof attackPlayer>
): string =>
  result
    ? `${accuracyDescriptor(result)} ${damageDescriptor(result)}`
    : "No result";

export const hpText = (result: ReturnType<typeof attackPlayer>): string =>
  result
    ? result.outcome === "cooldown"
      ? "on cooldown"
      : `${result.defender.hp}/${result.defender.maxHP} ${
          result.defender.hp <= 0 ? "(unconscious)" : ""
        }`
    : "No result";

export const attackRollText = (
  result: ReturnType<typeof attackPlayer>
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
  result: ReturnType<typeof attackPlayer>
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
      value: hpText(result),
    },
    {
      name: `Attack`,
      value: attackRollText(result),
    },
  ]);

  if (result.damage) embed.addField("Damage", "🩸 " + result.damage.toString());

  return embed;
};
