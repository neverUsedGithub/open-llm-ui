export interface FetchOptions {
  headers?: Record<string, string>;
  method?: string;
  body?: string;
}

export interface OpenLLMUIExtensionApi {
  fetchText(url: string, options?: FetchOptions): Promise<string>;
  fetchJSON(url: string, options?: FetchOptions): Promise<unknown>;
}

declare global {
  interface Window {
    OpenLLMUIExtension?: OpenLLMUIExtensionApi;
  }
}
