import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import { Character } from "../character/Character";
import { adjustGold } from "../character/adjustGold";
import { getUserCharacter } from "../character/getUserCharacter";
import { grantCharacterItem } from "../equipment/grantCharacterItem";
import {
  buckler,
  chainArmor,
  dagger,
  equipItemPrompt,
  heavyCrown,
  Item,
  itemEmbed,
  kiteShield,
  leatherArmor,
  longsword,
  mace,
  plateArmor,
  towerShield,
} from "../equipment/equipment";
import { updateCharacter } from "../character/updateCharacter";
import { weightedRandom } from "./encounters/weightedRandom";
import { times } from "remeda";

export const command = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("If you have coin, game has wares.");

const weights = new Map<Item, number>([
  [dagger, 1],
  [mace, 1],
  [longsword, 1],
  [leatherArmor, 1],
  [chainArmor, 1],
  [plateArmor, 1],
  [buckler, 1],
  [kiteShield, 1],
  [towerShield, 1],
  [heavyCrown, 1],
]);

// TODO: add shop to encounters
const randomInventoryItem = () =>
  Array.from(weights.keys())[weightedRandom(Array.from(weights.values()))];

// console.log(times(3, randomInventoryItem));

// const array = flatMap(weights, ([weapon, weight]) => weight);
// weightedRandom(flatMap(weights, ([weapon, weight]) => weight));
// debugger;

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shopImage = new MessageAttachment(
    "./images/weapon-shop.jpg",
    "shop.png"
  );
  const player = getUserCharacter(interaction.user);
  const inventory = times(3, randomInventoryItem);

  // weightedRandom()
  // weightedRandom(weights.map(x => x[1]))

  const message = await interaction.reply({
    files: [shopImage],
    embeds: [
      new MessageEmbed()
        .setImage(`attachment://${shopImage.name}`)
        .addField("Your Gold", "💰 " + player.gold.toString()),
      ...inventory.map(itemEmbed),
    ],
    components: [
      new MessageActionRow({ components: [inventorySelector(inventory)] }),
    ],
    fetchReply: true,
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
        files: [shopImage],
        embeds: [
          new MessageEmbed()
            .setImage(`attachment://${shopImage.name}`)
            .addField("Your Gold", "💰 " + player.gold.toString()),
          ...inventory.map(itemEmbed),
        ],
        components: [],
      });
    });

  if (!response || !response.isSelectMenu()) return;
  const item = inventory[parseInt(response.values[0])];
  if (!item) return;
  await buyItem(interaction, player, item);
};

const buyItem = async (
  interaction: CommandInteraction,
  player: Character,
  item: Item
) => {
  if (player.gold < item.goldValue) {
    await interaction.followUp(
      `You cannot afford the ${item.name}. You have only ${player.gold} gold and it costs ${item.goldValue}.`
    );
    return;
  }
  adjustGold(player.id, -item.goldValue);
  updateCharacter(grantCharacterItem(getUserCharacter(interaction.user), item));

  await equipItemPrompt(interaction, item);
};

export default { command, execute };

const inventorySelector = (inventory: Item[]) =>
  new MessageSelectMenu()
    .setCustomId("item")
    .setPlaceholder("What would you like to buy?")
    .addOptions(
      inventory.map((item, i) => ({
        label: item.name,
        description: `💰${item.goldValue} ${item.description}`,
        value: i.toString(),
      }))
    );
