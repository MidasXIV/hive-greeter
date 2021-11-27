import { CommandInteraction, Message, MessageActionRow } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { sellItem } from "./sellItem";
import { buyList } from "./buyList";

export async function sellItemPrompt({
  interaction,
}: {
  interaction: CommandInteraction;
}): Promise<void> {
  const character = getUserCharacter(interaction.user);
  const message = await interaction.editReply({
    components: [
      new MessageActionRow({
        components: [
          buyList({
            inventory: character.inventory.filter((i) => i.sellable),
            interaction,
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
      message.edit({
        components: [],
      });
    });
  if (!response) return;
  const slot = parseInt(response.values[0]);
  const item = character.inventory[slot];
  if (!item) return;
  sellItem({ character, item, percent: 0.8 });
}
