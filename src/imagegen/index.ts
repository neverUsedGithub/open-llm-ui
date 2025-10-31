import { comfyGenerateImage } from "./comfyui";
import fluxDevWorkflow from "./workflows/flux-dev.json";

export async function generateImage(prompt: string): Promise<Blob> {
  const workflow = structuredClone(fluxDevWorkflow);

  workflow[27].inputs.width = 512;
  workflow[27].inputs.height = 512;

  workflow[30].inputs.width = 512;
  workflow[30].inputs.height = 512;

  workflow[39].inputs.text = prompt;

  const image = await comfyGenerateImage(workflow, "http://localhost:8000");

  // Free up vram for ollama.
  // TODO: for high vram users add an option to disable this.
  await freeResources();

  return image;
}

export async function isAvailable(): Promise<boolean> {
  return fetch("http://localhost:8000").then(
    (r) => r.ok,
    () => false,
  );
}

export async function freeResources(): Promise<void> {
  await fetch(new URL("free", "http://localhost:8000"), {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ unload_models: true, free_memory: true }),
    method: "POST",
  });

  await new Promise((res) => setTimeout(res, 3000));
}
