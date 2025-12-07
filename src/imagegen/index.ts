import { comfyGenerateImage } from "./comfyui";

import fluxDevWorkflow from "./workflows/flux-dev.json";
import qwenImageWorkflow from "./workflows/qwen_image.json";
import zImageTurboWorkflow from "./workflows/z_image_turbo.json";

export type GenImageQuality = "low" | "medium" | "high";

const qualitySteps: Record<GenImageQuality, number> = {
  low: 3,
  medium: 6,
  high: 8,
};

function readyWorkflow(
  type: "flux-dev" | "qwen-image" | "z-image-turbo",
  prompt: string,
  width: number,
  height: number,
  quality: GenImageQuality,
): unknown {
  const stepCount = qualitySteps[quality] ?? qualitySteps["medium"];
  const randSeed = Math.floor(Math.random() * 1_000_000_000_000_000);

  if (type === "z-image-turbo") {
    const workflow = structuredClone(zImageTurboWorkflow);

    workflow[6].inputs.text = prompt;

    workflow[3].inputs.steps = stepCount;
    workflow[3].inputs.seed = randSeed;

    workflow[13].inputs.width = width;
    workflow[13].inputs.height = height;

    return workflow;
  }

  if (type === "flux-dev") {
    const workflow = structuredClone(fluxDevWorkflow);

    workflow[39].inputs.text = prompt;

    workflow[25].inputs.noise_seed = randSeed;

    workflow[27].inputs.width = width;
    workflow[27].inputs.height = height;

    workflow[30].inputs.width = width;
    workflow[30].inputs.height = height;

    return workflow;
  }

  const workflow = structuredClone(qwenImageWorkflow);

  workflow["75:6"].inputs.text = prompt;

  workflow["75:3"].inputs.seed = randSeed;
  workflow["75:3"].inputs.steps = stepCount;

  workflow["75:58"].inputs.width = width;
  workflow["75:58"].inputs.height = height;

  return workflow;
}

export interface GenImageOptions {
  width: number;
  height: number;
  quality: GenImageQuality;
  signal: AbortSignal;
}

export async function generateImage(prompt: string, options?: GenImageOptions): Promise<Blob> {
  const workflow = readyWorkflow(
    "z-image-turbo",
    prompt,
    options?.width ?? 512,
    options?.height ?? 512,
    options?.quality ?? "medium",
  );
  const image = await comfyGenerateImage(workflow, "http://localhost:8000", options?.signal);

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
