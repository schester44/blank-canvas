/**
 * Sawhorse app-data client — the ONLY way this app reads org data sources
 * (org databases, data connectors, installed apps) at runtime.
 *
 * How it works: at build time the agent PUBLISHES named, parameterized
 * capabilities (`publish_query`, `publish_connector_call`,
 * `publish_app_call`); this helper invokes them by name. The app never
 * holds credentials — the published capability is the authorization,
 * validated server-side on every call.
 *
 * Use `queryData()` for published SQL queries (row-shaped results) and
 * `invokeCapability()` for everything (queries, connector calls, app
 * operations — normalized `{ kind, data … }` results).
 *
 * Rules:
 * - SERVER-SIDE ONLY (server functions / loaders / API routes). The token
 *   must never reach the browser; the browser talks to this app's own
 *   server routes.
 * - A 410 means the data source was revoked/unavailable — render a visible
 *   "data source unavailable" state, never an empty chart.
 */

export interface QueryDataResult {
  rows: Record<string, unknown>[];
  rowCount: number;
  truncated: boolean;
}

export class DataSourceUnavailableError extends Error {
  constructor(query: string) {
    super(`Data source unavailable for capability "${query}" (revoked)`);
    this.name = "DataSourceUnavailableError";
  }
}

export type CapabilityResult =
  | {
      kind: "DATABASE_QUERY";
      rows: Record<string, unknown>[];
      rowCount: number;
      truncated: boolean;
    }
  | { kind: "CONNECTOR_CALL" | "APP_OPERATION"; data: unknown; truncated: boolean };

function requireEnv(): { base: string; token: string } {
  const base = process.env.SAWHORSE_DATA_URL;
  const token = process.env.SAWHORSE_DATA_TOKEN;

  if (!base || !token) {
    throw new Error(
      "SAWHORSE_DATA_URL / SAWHORSE_DATA_TOKEN are not set — sawhorse-data helpers only work inside a Sawhorse session sandbox.",
    );
  }

  return { base, token };
}

/**
 * Invoke ANY published capability by name (query, connector call, or app
 * operation). SERVER-SIDE ONLY.
 */
export async function invokeCapability(
  capability: string,
  params: Record<string, unknown> = {},
): Promise<CapabilityResult> {
  const { base, token } = requireEnv();

  const res = await fetch(`${base}/api/app-data/invoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ capability, params }),
  });

  if (res.status === 410) throw new DataSourceUnavailableError(capability);

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : `Capability "${capability}" failed: ${res.status}`,
    );
  }

  return data as unknown as CapabilityResult;
}

export async function queryData(
  query: string,
  params: Record<string, unknown> = {},
): Promise<QueryDataResult> {
  const { base, token } = requireEnv();

  const res = await fetch(`${base}/api/app-data/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, params }),
  });

  if (res.status === 410) throw new DataSourceUnavailableError(query);

  const data = (await res.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : `Data query "${query}" failed: ${res.status}`,
    );
  }

  return data as unknown as QueryDataResult;
}
