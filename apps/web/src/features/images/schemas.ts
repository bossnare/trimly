import { z } from "zod";
import { DIMENSION_LIMITS, QUALITY } from "./constants";
import type { ToolId, ToolOptionsMap } from "./types";

const dimension = z
  .number({ invalid_type_error: "Enter a whole number." })
  .int("Enter a whole number.")
  .min(DIMENSION_LIMITS.min, `Minimum is ${DIMENSION_LIMITS.min} px.`)
  .max(DIMENSION_LIMITS.max, `Maximum is ${DIMENSION_LIMITS.max} px.`)
  .nullable();

const quality = z
  .number()
  .int()
  .min(QUALITY.min, `Quality must be between ${QUALITY.min} and ${QUALITY.max}.`)
  .max(QUALITY.max, `Quality must be between ${QUALITY.min} and ${QUALITY.max}.`);

export const resizeSchema = z
  .object({
    width: dimension,
    height: dimension,
    fit: z.enum(["cover", "contain", "fill", "inside", "outside"]),
    withoutEnlargement: z.boolean(),
  })
  .refine((v) => v.width !== null || v.height !== null, {
    message: "Set a width or a height to resize.",
    path: ["width"],
  });

export const convertSchema = z.object({
  format: z.enum(["jpeg", "png", "webp", "avif"]),
  quality,
});

export const compressSchema = z.object({ quality });

export const removeBackgroundSchema = z.object({
  fill: z.enum(["transparent", "white", "custom"]),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #0c8477."),
});

export const toolSchemas = {
  resize: resizeSchema,
  convert: convertSchema,
  compress: compressSchema,
  removeBackground: removeBackgroundSchema,
} as const satisfies Record<ToolId, z.ZodTypeAny>;

export type OptionsValidation = { valid: true } | { valid: false; message: string };

export function validateOptions<T extends ToolId>(tool: T, options: ToolOptionsMap[T]): OptionsValidation {
  const result = toolSchemas[tool].safeParse(options);
  if (result.success) return { valid: true };
  return { valid: false, message: result.error.issues[0]?.message ?? "These settings aren't valid." };
}
