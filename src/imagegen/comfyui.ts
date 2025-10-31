export async function comfyGenerateImage(workflow: any, comfyEndpoint: string): Promise<Blob> {
  const historyEndpoint = new URL("history/", comfyEndpoint);
  const promptEndpoint = new URL("prompt", comfyEndpoint);
  const queueEndpoint = new URL("queue", comfyEndpoint);
  const viewEndpoint = new URL("view", comfyEndpoint);

  const response = await fetch(promptEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: workflow }),
  });

  if (!response.ok) {
    throw new Error(`ComfyUI API error: ${response.status} - ${await response.text()}`);
  }

  const data = (await response.json()) as { prompt_id: string };
  const promptId = data.prompt_id;

  await new Promise<void>((res, rej) => {
    async function poll() {
      try {
        const queueResponse = await fetch(queueEndpoint);

        if (!queueResponse.ok) {
          throw new Error(`Failed to fetch queue status: ${queueResponse.statusText}`);
        }

        const queueData = (await queueResponse.json()) as {
          queue_running: [string, string][];
          queue_pending: [string, string][];
        };

        const promptInQueue =
          queueData.queue_running.some((item: [string, string]) => item[1] === promptId) ||
          queueData.queue_pending.some((item: [string, string]) => item[1] === promptId);

        if (!promptInQueue) {
          res();
        } else {
          setTimeout(poll, 1000);
        }
      } catch (error) {
        rej(error);
      }
    }

    poll();
  });

  const historyResponse = await fetch(new URL(promptId, historyEndpoint));
  if (!historyResponse.ok) {
    throw new Error(`Failed to fetch history: ${historyResponse.statusText}`);
  }

  const historyData = (await historyResponse.json()) as {
    [key: string]: {
      outputs: {
        [nodeId: string]: {
          images?: Array<{
            filename: string;
            subfolder: string;
            type: string;
          }>;
        };
      };
    };
  };

  const history = historyData[promptId];

  if (!history || !history.outputs) {
    throw new Error("Could not find image details in history");
  }

  const outputKey = Object.keys(history.outputs)[0];
  if (!outputKey || !history.outputs[outputKey]) {
    throw new Error("Could not find image output in history entry");
  }

  const outputNode = history.outputs[outputKey];
  if (!outputNode.images || outputNode.images.length === 0) {
    throw new Error("No images found in output");
  }

  const imageDetails = outputNode.images[0];
  if (!imageDetails) {
    throw new Error("No image details found in output node");
  }

  viewEndpoint.searchParams.set("type", imageDetails.type);
  viewEndpoint.searchParams.set("filename", imageDetails.filename);
  viewEndpoint.searchParams.set("subfolder", imageDetails.subfolder);

  const imageResponse = await fetch(viewEndpoint);

  if (!imageResponse.ok) {
    throw new Error(`Failed to download image: ${imageResponse.statusText}`);
  }

  return imageResponse.blob();
}
