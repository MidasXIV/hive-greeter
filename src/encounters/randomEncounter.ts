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
import { angels } from "./angels";
import { shop } from "./shop/shop";
import { weightedTable } from "../utils/weightedTable";

export const randomEncounter = () =>
  weightedTable([
    [0.5, angels],
    [1, armorShrine],
    [1, attackShrine],
    [1, vigorShrine],
    [2, chest],
    [0.05, divineBlessing],
    [1, fairyWell],
    [2, monster],
    [1, shop],
    [1, tavern],
    [1, trap],
    [1, travel],
  ]);
