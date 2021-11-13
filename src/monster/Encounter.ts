export type Encounter = {
  id: string;
  characterId: string;
  date: string;
  result?: "won" | "lost" | "fled" | "evaded";
};
