import { progressBar } from "../../utils/progress-bar";
import { AttackResult } from "../../attack/AttackResult";
import { averageRoll } from "./averageRoll";

export const accuracyBar = (attacks: AttackResult[]): string => `${progressBar(
  averageRoll(attacks) / 20,
  10
)} 
  Average Roll: ${averageRoll(attacks).toFixed(2).toString()}`;
