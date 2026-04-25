const withTimeout = async (promise: Promise<Response>, ms: number) => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), ms)
  );
  return Promise.race([promise, timeout]) as Promise<Response>;
};

const isJsonResponse = (response: Response) =>
  (response.headers.get("content-type") || "").includes("application/json");

const envBaseRaw = (import.meta?.env?.VITE_API_BASE as string | undefined)?.trim();
const envBase = envBaseRaw ? envBaseRaw.replace(/\/$/, "") : "";

const PROD_FALLBACK_BASE = "https://bluevinza-vinzatools-backend.hf.space";
const hostedApiFallbacks = [PROD_FALLBACK_BASE];

const isHostedFrontend = (hostname: string) =>
  /(?:vercel\.app|vinzatools\.com|bluevinza\.com)$/i.test(hostname);

const isVinzaProdHost = () => {
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith("vinzatools.com");
};

const buildCandidates = () => {
  const candidates: string[] = [];

  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;

    if (envBase) {
      candidates.push(envBase);
    }

    // Production safety: never fall back to relative `/api/*` on Vercel, because that returns
    // an HTML 404 page and the UI crashes while parsing JSON.
    if (isVinzaProdHost()) {
      candidates.push(PROD_FALLBACK_BASE);
    } else if (isHostedFrontend(hostname)) {
      candidates.push(...hostedApiFallbacks);
    }

    if (isHostedFrontend(hostname)) {
      // Keep the old fallback behavior for preview hosts too.
      candidates.push(...hostedApiFallbacks);
    }
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
        // Validate candidate with a quick /api/health probe.
        // This prevents misconfigured VITE_API_BASE (e.g. pointing at the frontend domain)
        // from breaking every tool with HTML 404 pages.
        const timeoutMs = base === PROD_FALLBACK_BASE ? 8_000 : envBase ? 4_000 : 1_500;
        const response = await withTimeout(fetch(`${base}/api/health`), timeoutMs);
        if (response.ok && isJsonResponse(response)) {
          return base;
        }
      } catch {
        // try next
      }
    }
    if (isVinzaProdHost()) return PROD_FALLBACK_BASE;
    return "";
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
