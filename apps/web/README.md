# Trimly

Image tools in one tab: resize, convert, compress and remove the background.
Front-end for an existing image-processing backend.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, TanStack Query, axios, motion, lucide-react, zod, next-themes.

## Getting started

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE_URL
npm install
npm run dev                  # http://localhost:3000
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`.

## Architecture

Dependencies only point one way: `app → features → components → lib`.

```
src/
  app/            Routing and metadata only (server components). globals.css = design tokens.
  features/
    landing/      Marketing page sections and their content.
    editor/       Three-column editor: tool rail, stage, inspector. State and options panels.
    images/       The image domain, no React UI: types, constants, zod schemas,
                  api/ (axios calls), hooks/ (TanStack Query), utils/.
  components/
    ui/           Generic primitives (Button, Switch, Slider, SegmentedControl...).
    layout/       Logo, ThemeToggle.
    shared/       Reusable blocks (CompareSlider, FitDiagram, PreviewImage, SampleScene).
  lib/
    http/         axios factory, ApiError, one interceptor that normalises every failure.
    utils/        cn, format helpers.
  providers/      Query, theme and motion providers.
  config/         env, validated with zod.
```

### How data flows

1. **Import** (`editor/hooks/use-import-image`): a file or a URL becomes a `SourceImage`
   (validated, decoded to read its real size). URLs go through `app/api/image-proxy`
   (SSRF-protected, size-limited) to avoid CORS.
2. **State** (`editor/state`): `useReducer` + context holds the tool, per-tool options and the source image.
3. **Processing** (`images/hooks/use-process-image`): one TanStack query per (image, tool, options),
   debounced, cancelled through `AbortSignal` when settings change, cached, retried only for
   network, timeout, 429 and 5xx errors.
4. **Phase** (`editor/state/editor-phase`): `empty | processing | result | error` is **derived**, never stored.
5. **UI**: the stage, inspector and download bars read the phase and result from context.

### Backend contract

Paths live in `features/images/api/endpoints.ts`; field mapping in `request-mappers.ts`.
All routes take `multipart/form-data` with `file` and return the processed image as binary.

| Route | Fields |
| --- | --- |
| `POST /images/resize` | `width?`, `height?`, `fit`, `withoutEnlargement` |
| `POST /images/convert` | `format`, `quality?` (not for PNG) |
| `POST /images/compress` | `quality?` (not for PNG, format is kept) |
| `POST /images/remove-background` | `fill`, `color?` (only when `fill=custom`) |

Adjust those two files if your backend differs. Nothing else knows about routes or field names.

## Scenarios handled

- **Files:** empty file, wrong type, over 10 MB, corrupted image, several files dropped (first one used).
- **URLs:** invalid link, non-http(s), private or local addresses, not an image, too large, slow host, redirects.
- **Settings:** width or height required for resize, 1–16384 px, quality 1–100, quality hidden for PNG,
  aspect ratio lock, prevent enlargement on by default.
- **Requests:** debounce, cancellation of stale requests, caching, retry rules, 413, 415, 429 (with `Retry-After`), timeout, offline.
- **Results:** result larger than the original (shown as `+x%`), download name and extension follow the real output format.
- **UI:** light and dark theme, reduced motion, keyboard-accessible slider, tabs and switches, mobile sticky download bar.

## Add a tool

1. Add its id and options to `features/images/types.ts`, defaults to `constants.ts`, a schema to `schemas.ts`.
2. Add its endpoint and field mapping in `images/api`.
3. Add an entry to `editor/tool-meta.ts` and an options component registered in `editor/components/options/options-panel.tsx`.

## Notes

- Fonts (Bricolage Grotesque and Instrument Sans) load through `next/font/google` at build time.
- Design tokens use shadcn variable names (`--background`, `--primary`, `--card`...) plus `--brand`,
  `--brand-fill` and `--glow`. The primary button is monochrome; teal is the accent.
- Recommended next steps: Vitest + Testing Library for `images/utils` and the reducer, MSW for the API layer.
