export interface SearchResult {
  title: string;
  url: string;

  description?: string;
  extra?: string[];
}

export interface SearchOptions {
  count?: number;
}

export abstract class SearchProvider {
  abstract search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}