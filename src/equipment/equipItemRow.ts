import { MessageActionRow, MessageButton } from "discord.js";
import { Item } from "./Item";

export const equipItemRow = (item: Item): MessageActionRow =>
  new MessageActionRow({
    components: [
      new MessageButton({
        customId: "equip",
        label: `Equip the ${item.name}`,
        style: "PRIMARY",
      }),
    ],
  });
