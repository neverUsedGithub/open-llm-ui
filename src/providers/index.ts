import { OllamaProvider } from "./ollama";
import type { ListedModel } from "@/types";
import type { ModelProvider } from "./provider";

export class ProviderManager {
  private static instance: ProviderManager | null = null;
  private providers: Record<string, ModelProvider> | null = null;

  public static getInstance(): ProviderManager {
    if (!this.instance) this.instance = new ProviderManager();
    return this.instance;
  }

  private constructor() {}

  public async load(): Promise<void> {
    if (this.providers !== null) return;

    this.providers = {
      ollama: new OllamaProvider(),
    };
  }

  public async getProvider(name: string): Promise<ModelProvider | null> {
    if (this.providers === null) await this.load();
    return this.providers![name] ?? null;
  }

  public async listModels(): Promise<ListedModel[]> {
    await this.load();
    const models: ListedModel[] = [];

    for (const provider in this.providers) {
      models.push(...(await this.providers[provider].listModels()).map((identifier) => ({ identifier, provider })));
    }

    return models;
  }

  public async listRunningModels(): Promise<ListedModel[]> {
    await this.load();
    const models: ListedModel[] = [];

    for (const provider in this.providers) {
      models.push(
        ...(await this.providers[provider].listRunningModels()).map((identifier) => ({ identifier, provider })),
      );
    }

    return models;
  }
}
