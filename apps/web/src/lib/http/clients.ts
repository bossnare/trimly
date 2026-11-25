import { env } from "@/config/env";
import { createHttpClient } from "./create-client";

/** Image-processing backend. Processing can be slow on large files, hence the long timeout. */
export const backendClient = createHttpClient(env.NEXT_PUBLIC_API_BASE_URL, 60_000);

/** Next.js route handlers living in this app (e.g. the remote image proxy). */
export const localClient = createHttpClient("/api", 30_000);
