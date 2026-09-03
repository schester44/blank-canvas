/**
 * Sawhorse app-data client — the ONLY way this app reads org data sources
 * (org databases, and eventually connectors/apps) at runtime.
 *
 * How it works: at build time the agent PUBLISHES named, parameterized
 * capabilities (e.g. `publish_query`); this helper invokes them by name.
 * The app never holds database credentials — the published capability is
 * the authorization, validated server-side on every call.
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
    super(`Data source unavailable for query "${query}" (revoked)`);
    this.name = "DataSourceUnavailableError";
  }
}

export async function queryData(
  query: string,
  params: Record<string, unknown> = {},
): Promise<QueryDataResult> {
  const base = process.env.SAWHORSE_DATA_URL;
  const token = process.env.SAWHORSE_DATA_TOKEN;

  if (!base || !token) {
    throw new Error(
      "SAWHORSE_DATA_URL / SAWHORSE_DATA_TOKEN are not set — queryData() only works inside a Sawhorse session sandbox.",
    );
  }

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
