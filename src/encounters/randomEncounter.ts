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
import { shop } from "./shop";
import { angels } from "./angels";

type CommandHandler = (interaction: CommandInteraction) => Promise<void>;
type EncounterId =
  | "angels"
  | "armorShrine"
  | "attackShrine"
  | "chest"
  | "divineBlessing"
  | "fairyWell"
  | "monster"
  | "shop"
  | "tavern"
  | "trap"
  | "travel"
  | "vigorShrine";

type Encounters = {
  [key in EncounterId]: CommandHandler;
};

type randomEncounter = CommandHandler;
const encounterWeights = {
  angels: 1,
  armorShrine: 1,
  attackShrine: 1,
  vigorShrine: 1,
  chest: 2,
  divineBlessing: 0.05,
  fairyWell: 1,
  monster: 2,
  shop: 1,
  tavern: 1,
  trap: 1,
  travel: 1,
};

// TODO: refactor to Map<EncounterId, weight> to prevent mis-alignment bugs
const encounters: CommandHandler[] = [
  angels,
  armorShrine,
  attackShrine,
  vigorShrine,
  chest,
  divineBlessing,
  fairyWell,
  monster,
  shop,
  tavern,
  trap,
  travel,
];

export const randomEncounter = (): CommandHandler =>
  encounters[weightedRandom(Object.values(encounterWeights))];
