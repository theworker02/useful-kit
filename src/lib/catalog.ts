export type Tool = {
  id: string;
  name: string;
  batch: number;
  category: string;
  summary: string;
  engine: string;
  inputs: { id: string; label: string; sample: string }[];
  options: Record<string, string | number | boolean>;
  docs: { what: string; when: string; notes: string };
};

export type Catalog = {
  product: {
    name: string;
    tagline: string;
    description: string;
  };
  count: number;
  batchSize: number;
  batchCount: number;
  tools: Tool[];
};

let cached: Catalog | null = null;

export async function loadCatalog(): Promise<Catalog> {
  if (cached) return cached;
  const res = await fetch(`${import.meta.env.BASE_URL}catalog.json`);
  if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
  cached = (await res.json()) as Catalog;
  return cached;
}
