import { database } from "@/indexeddb";
import type { UserPreferences } from "@/types";

export interface PreferenceEntry {
  name: string;
  value: any;
}

export async function loadPreference<T extends keyof UserPreferences>(key: T): Promise<UserPreferences[T] | null> {
  const result = await database.query<PreferenceEntry>("preferences", key);
  if (result) return result.value;
  return null;
}

export async function savePreference<T extends keyof UserPreferences>(
  name: T,
  value: UserPreferences[T],
): Promise<void> {
  await database.put("preferences", { name, value });
}
