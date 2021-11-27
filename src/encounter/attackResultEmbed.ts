import { CommandInteraction, MessageEmbed } from "discord.js";
import { AttackResult } from "../attack/AttackResult";
import { hpBarField } from "../character/hpBar/hpBarField";
import { Emoji } from "../Emoji";
import { attackFlavorText, attackRollText } from "../commands/attack";

export function attackResultEmbed({
  result,
  interaction,
}: {
  result: AttackResult;
  interaction: CommandInteraction;
}): MessageEmbed {
  if (result.outcome === "cooldown") {
    return new MessageEmbed({
      description: `Cooldown.`,
    });
  }
  return new MessageEmbed({
    description: `${attackFlavorText(result)}
    ${attackRollText({
      result,
      interaction,
    })}
    ${Emoji(interaction, "damage")} ${result.damageRoll} Damage
    ${
      result.monsterDamageRoll
        ? `${Emoji(interaction, "monsterDamageMax")} ${
            result.monsterDamageRoll
          } Monster Damage`
        : ""
    }`,
    fields: [
      hpBarField(
        result.defender,
        result.outcome === "hit" ? -result.damage : 0,
        true
      ),
    ],
  }).setThumbnail(result.attacker.profile);
}
