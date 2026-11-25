import type { ToolId, ToolOptions } from "./types";

/** Query key factory. Index 3 is always the tool (used to scope placeholder data). */
export const imageKeys = {
  all: ["images"] as const,
  process: (fileId: string | undefined, tool: ToolId, options: ToolOptions) =>
    [...imageKeys.all, "process", fileId ?? "none", tool, options] as const,
  remote: (url: string) => [...imageKeys.all, "remote", url] as const,
};
