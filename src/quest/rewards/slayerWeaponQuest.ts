import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import { updateCharacter } from "../../updateCharacter";
import { getUserCharacter } from "../../getUserCharacter";
import {
  dagger,
  equipItemPrompt,
  longsword,
  mace,
  Weapon,
} from "../../equipment/equipment";

export const slayerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const weaponTemplates = [dagger, mace, longsword];
  const embeds = [
    new MessageEmbed({
      title: `Slayer Quest Complete!`,
      description:
        'The Knight Marshal congratulates you with a firm handshake and a shoulder slap. "You\'ve done this city a great service, soldier."\n\n"Now for your well-earned reward..."',
    }),
  ];
  const message = await interaction.followUp({
    fetchReply: true,
    embeds,
    components: [
      new MessageActionRow({
        components: [
          new MessageSelectMenu({
            customId: "weaponTemplate",
            placeholder: "What is your weapon of choice?",
            options: weaponTemplates.map((item, i) => ({
              label: item.name,
              description: item.description,
              value: i.toString(),
            })),
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  const response = await message
    .awaitMessageComponent({
      filter: (i) => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      },
      componentType: "SELECT_MENU",
      time: 60000,
    })
    .catch(() => {
      message.edit({ embeds, components: [] });
    });
  if (!response) {
    interaction.followUp(
      `Another time, perhaps? Come back when you're ready to make your choice.`
    );
    return;
  }
  if (!response || !response.isSelectMenu()) return;
  const chosenWeapon = weaponTemplates[parseInt(response.values[0])];
  if (!chosenWeapon) {
    interaction.followUp(
      `Another time, perhaps? Come back when you're ready to make your choice.`
    );
    return;
  }
  const weapon: Weapon = {
    ...chosenWeapon,
    name: `Slayer's ${chosenWeapon.name}`,
    modifiers: { ...chosenWeapon.modifiers, monsterDamageMax: 6 },
  };
  updateCharacter({
    ...character,
    inventory: [...character.inventory, weapon],
    quests: { slayer: undefined },
  });
  await equipItemPrompt(interaction, weapon);
};
