const withTimeout = async (promise: Promise<Response>, ms: number) => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), ms)
  );
  return Promise.race([promise, timeout]) as Promise<Response>;
};

const isJsonResponse = (response: Response) =>
  (response.headers.get("content-type") || "").includes("application/json");

const envBase = (import.meta?.env?.VITE_API_BASE as string | undefined)?.trim();

const buildCandidates = () => {
  const candidates: string[] = [];
  if (envBase) candidates.push(envBase.replace(/\/$/, ""));

  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    candidates.push(`${protocol}//${hostname}${port ? `:${port}` : ""}`);
    for (let p = 3000; p <= 3010; p += 1) {
      candidates.push(`${protocol}//${hostname}:${p}`);
    }
    candidates.push(`http://127.0.0.1:3000`);
    for (let p = 3001; p <= 3010; p += 1) {
      candidates.push(`http://127.0.0.1:${p}`);
    }
  }

  return Array.from(new Set(candidates));
};

let basePromise: Promise<string> | null = null;

export const resolveApiBase = async () => {
  if (basePromise) return basePromise;
  basePromise = (async () => {
    const candidates = buildCandidates();
    for (const base of candidates) {
      try {
        const response = await withTimeout(fetch(`${base}/api/health`), 1200);
        if (response.ok && isJsonResponse(response)) {
          return base;
        }
      } catch {
        // try next
      }
    }
    return envBase || "";
  })();
  return basePromise;
};

export const apiFetch = async (path: string, options?: RequestInit) => {
  const base = await resolveApiBase();
  const url = `${base}${path}`;
  return fetch(url, options);
};

export const apiHref = async (path: string) => {
  const base = await resolveApiBase();
  return `${base}${path}`;
};
