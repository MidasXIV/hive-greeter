import { divineBlessing } from "./divineBlessing";
import { fairyWell } from "./fairyWell";
import { monster } from "./monster";
import { tavern } from "./tavern/tavern";
import { trap } from "./trap";
import { travel } from "./travel";
import { chest } from "./chest";
import { angels } from "./angels";
import { shop } from "./shop/shop";
import { weightedTable } from "../utils/weightedTable";
import { randomShrine } from "./shrine/randomShrine";
import { CommandHandler } from "../utils";

export const randomEncounter = (): CommandHandler =>
  weightedTable([
    [0.1, () => divineBlessing],
    [1, () => angels],
    [1, () => fairyWell],
    [1, () => shop],
    [1, () => tavern],
    [1, () => trap],
    [1, () => travel],
    [2, () => monster],
    [2, () => chest],
    [2, randomShrine],
  ])();
