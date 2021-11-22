import OpenAI from "openai-api";
import { namesByKind } from "../data";

export type MonsterKind = "Goblin" | "Orc" | "Bandit";

const monsterKinds: MonsterKind[] = ["Goblin", "Orc", "Bandit"];

const prompts = new Map<MonsterKind, string>(
  monsterKinds.map((kind) => [
    kind,
    `This is a ${kind} name generator

Monster kind: orc
Seed names: ${(namesByKind.get("Orc")?.slice(0, -3) ?? []).join(", ")}
Monster names: ${(namesByKind.get("Orc")?.slice(-3) ?? []).join(", ")}

Monster kind: ${kind}
Seed names: ${(namesByKind.get(kind) ?? []).join(", ")}
Monster names:`,
  ])
);

// get a random array element
function randomArrayElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const getRandomMonsterName = async (
  kind: MonsterKind
): Promise<string> => {
  try {
    if (typeof process.env.OPEN_AI_KEY !== "string") return kind;
    const openai = new OpenAI(process.env.OPEN_AI_KEY);
    const prompt = prompts.get(kind);
    console.log({ prompt });
    const gptResponse = await openai.complete({
      engine: "davinci",
      prompt,
      maxTokens: 20,
      temperature: 0.5,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
      bestOf: 1,
      n: 1,
      stream: false,
    });
    const result =
      randomArrayElement(
        gptResponse.data.choices
          .map((x) => x.text)[0]
          .split(",")
          .filter(Boolean)
      ).trim() || kind;
    console.log({ result });
    return result;
  } catch (e) {
    console.error(`getRandomMonsterName failed for ${kind}`, e);
    return kind;
  }
};

// (async () => {
//   for (let index = 0; index < 10; index++) {
//     console.log(await getRandomMonsterName("Bandit"));
//   }
// })();
