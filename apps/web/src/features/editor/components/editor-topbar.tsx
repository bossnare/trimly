"use client";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { useResetEditor } from "../hooks/use-reset-editor";
import { useEditor } from "../state/editor-context";
import { useProcessing } from "../state/processing-context";

export function EditorTopbar() {
  const { state } = useEditor();
  const { phase } = useProcessing();
  const reset = useResetEditor();
  return (
    <header className="flex min-h-15 items-center justify-between gap-3 border-b border-border px-4 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <Logo />
        <span aria-hidden className="text-border">
          /
        </span>
        <span className="truncate text-muted-foreground">{state.source?.name ?? "New image"}</span>
      </div>
      <div className="flex items-center gap-2">
        {state.source && (
          <Button variant="outline" size="sm" onClick={reset}>
            {phase === "processing" ? "Cancel" : "Upload another"}
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
