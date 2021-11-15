import { MessageActionRow, MessageButton } from "discord.js";
import { Item } from "./equipment";

export const equipItemRow = (item: Item): MessageActionRow =>
  new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("equip")
      .setLabel(`Equip the ${item.name}`)
      .setStyle("PRIMARY")
  );
