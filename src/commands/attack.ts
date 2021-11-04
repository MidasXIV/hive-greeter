import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { attackPlayer, getUserCharacter } from "../db";
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
    result.attackRoll + result.attacker.attackBonus - result.defender.ac;
  switch (true) {
    case accuracy >= 5:
      return `${mentionCharacter(result.attacker)} strikes ${mentionCharacter(
        result.defender
      )} true`;
    case accuracy >= 2:
      return `${mentionCharacter(result.attacker)} finds purchase against ${
        result.defender.name
      }`;
    case accuracy >= 1:
      return `${mentionCharacter(
        result.attacker
      )} narrowly hits ${mentionCharacter(result.defender)}`;
    case accuracy === 0:
      return `${mentionCharacter(
        result.attacker
      )} barely hits ${mentionCharacter(result.defender)}`;
    case accuracy <= 1:
      return `${mentionCharacter(
        result.attacker
      )} narrowly misses ${mentionCharacter(result.defender)}`;
    case accuracy <= 2:
      return `${mentionCharacter(result.attacker)} misses ${mentionCharacter(
        result.defender
      )}`;
    case accuracy < 5:
      return `${mentionCharacter(result.attacker)} misses ${mentionCharacter(
        result.defender
      )} utterly`;
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
    ? `${accuracyDescriptor(result)} ${
        result.outcome === "hit" ? damageDescriptor(result) : ""
      }`
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
): string =>
  result
    ? result.outcome === "cooldown"
      ? "on cooldown"
      : `${result.attackRoll}+${result.attacker.attackBonus} (${
          result.attackRoll + result.attacker.attackBonus
        }) vs ${result.defender.ac} ac${
          result.outcome === "hit" ? ` for ${result.damage} damage` : ""
        }.`
    : "No result";

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
