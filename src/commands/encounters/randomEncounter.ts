import { CommandInteraction } from "discord.js";
import { armorShrine } from "./shrine/armor";
import { attackShrine } from "./shrine/attack";
import { divineBlessing } from "./divineBlessing";
import { fairyWell } from "./fairyWell";
import { monster } from "./monster";
import { tavern } from "./tavern/tavern";
import { trap } from "./trap";
import { travel } from "./travel";
import { chest } from "./chest";
import { vigorShrine } from "./shrine/vigor";
import { weightedRandom } from "./weightedRandom";

type CommandHandler = (interaction: CommandInteraction) => Promise<void>;
type EncounterId =
  | "armorShrine"
  | "attackShrine"
  | "chest"
  | "divineBlessing"
  | "fairyWell"
  | "monster"
  | "tavern"
  | "trap"
  | "travel"
  | "vigorShrine";

type Encounters = {
  [key in EncounterId]: CommandHandler;
};

type randomEncounter = CommandHandler;
const weights = {
  armorShrine: 1,
  attackShrine: 1,
  chest: 2,
  divineBlessing: 0.01,
  fairyWell: 1,
  monster: 2,
  tavern: 2,
  trap: 1,
  travel: 1,
  vigorShrine: 1,
};
const items: CommandHandler[] = [
  armorShrine,
  attackShrine,
  chest,
  divineBlessing,
  fairyWell,
  monster,
  tavern,
  trap,
  travel,
  vigorShrine,
];

export const randomEncounter = (): CommandHandler =>
  items[weightedRandom(Object.values(weights))];
