import type { OpenLLMUIExtensionApi } from "@/extension";

export function isExtensionInstalled() {
  return typeof window.OpenLLMUIExtension !== "undefined";
}

export const extensionApi: OpenLLMUIExtensionApi = window.OpenLLMUIExtension!;
