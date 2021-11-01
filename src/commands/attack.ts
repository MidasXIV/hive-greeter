import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { attack, getUserCharacter } from "../db";

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
  const result = attack(attacker.id, defender.id);
  await showAttackResult(result, interaction);
};

export default { command, execute };

const showAttackResult = async (
  result: ReturnType<typeof attack>,
  interaction: CommandInteraction
): Promise<void> => {
  await interaction.reply({ embeds: [attackResultEmbed(result)] });
  // case "cooldown":
  //   await interaction.reply(`You can't do that yet.`);
  //   break;
};

const accuracyDescriptor = (result: ReturnType<typeof attack>) => {
  if (!result) return `No result`;
  const accuracy =
    result.attackRoll + result.attacker.attackBonus - result.defender.ac;
  switch (true) {
    case accuracy >= 5:
      return `${result.attacker.name} strikes ${result.defender.name} true`;
    case accuracy >= 2:
      return `${result.attacker.name} finds purchase against ${result.defender.name}`;
    case accuracy >= 1:
      return `${result.attacker.name} narrowly hits ${result.defender.name}`;
    case accuracy === 0:
      return `${result.attacker.name} barely hits ${result.defender.name}`;
    case accuracy <= 1:
      return `${result.attacker.name} narrowly misses ${result.defender.name}`;
    case accuracy <= 2:
      return `${result.attacker.name} misses ${result.defender.name}`;
    case accuracy < 5:
      return `${result.attacker.name} misses ${result.defender.name} utterly`;
  }
};

const damageDescriptor = (result: ReturnType<typeof attack>) => {
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

export const attackFlavorText = (result: ReturnType<typeof attack>): string =>
  result
    ? `${accuracyDescriptor(result)} ${
        result.outcome === "hit" ? damageDescriptor(result) : ""
      }`
    : "No result";

export const hpText = (result: ReturnType<typeof attack>): string =>
  result
    ? `${result.defender.hp}/${result.defender.maxHP} ${
        result.defender.hp <= 0 ? "(unconscious)" : ""
      }`
    : "No result";

export const attackRollText = (result: ReturnType<typeof attack>): string =>
  result
    ? `${result.attackRoll}+${result.attacker.attackBonus} (${
        result.attackRoll + result.attacker.attackBonus
      }) vs ${result.defender.ac} ac${
        result.outcome === "hit" ? ` for ${result.damage} damage` : ""
      }.`
    : "No result";

const attackResultEmbed = (result: ReturnType<typeof attack>): MessageEmbed => {
  const embed = new MessageEmbed().setDescription(attackFlavorText(result));
  if (!result) return embed;

  switch (result.outcome) {
    case "hit":
      embed.setImage("https://i.imgur.com/rM6yWps.png");
      break;
    case "miss":
      embed.setImage("https://i.imgur.com/xVlTNQm.png");
      break;
    default:
      break;
  }

  embed.addFields([
    {
      name: `${result.defender.name} HP`,
      value: hpText(result),
    },
    {
      name: `Attack Roll`,
      value: attackRollText(result),
    },
  ]);

  return embed;
};
