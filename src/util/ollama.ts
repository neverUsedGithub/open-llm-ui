import ollama from "ollama";

export async function freeOllamaModel(model: string): Promise<void> {
  await ollama.generate({
    model: model,
    keep_alive: 0,
    prompt: "",
  });

  await new Promise((res) => setTimeout(res, 1000));
}
