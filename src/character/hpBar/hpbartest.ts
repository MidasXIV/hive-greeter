import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { createCharacter } from "../createCharacter";
import { hpBarField } from "./hpBarField";

export const command = new SlashCommandBuilder()
  .setName("hpbartest")
  .setDescription("Show hp bar variants.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const half = createCharacter({
    name: "Test",
    hp: 5,
    maxHP: 10,
  });
  const full = createCharacter({
    name: "Test",
    hp: 10,
    maxHP: 10,
  });
  const ko = createCharacter({
    name: "Test",
    hp: 0,
    maxHP: 10,
  });

  interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: "Heal",
        fields: [hpBarField(half, 3)],
      }),
      new MessageEmbed({
        title: "Overheal",
        fields: [hpBarField(full, 300)],
      }),
      new MessageEmbed({
        title: "Damage",
        fields: [hpBarField(half, -3)],
      }),
      new MessageEmbed({
        title: "Overkill",
        fields: [hpBarField(ko, -100)],
      }),
    ],
  });
};

export default { command, execute };
