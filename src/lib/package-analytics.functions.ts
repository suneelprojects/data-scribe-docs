import { createServerFn } from "@tanstack/react-start";
import type { AnalyticsPayload } from "./package-analytics.server";

export type { AnalyticsPayload };

/** Public, cache-only read. Never hits external APIs. */
export const getPackageAnalytics = createServerFn({ method: "GET" }).handler(
  async (): Promise<AnalyticsPayload | null> => {
    const { readCachedAnalytics } = await import("./package-analytics.server");
    return readCachedAnalytics();
  },
);
