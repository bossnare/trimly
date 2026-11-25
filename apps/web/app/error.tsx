"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      <h1 className="text-gradient font-heading text-5xl font-extrabold tracking-tight">Something broke.</h1>
      <p className="max-w-sm text-muted-foreground">An unexpected error happened. Try again, and if it keeps happening reload the page.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
