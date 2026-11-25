"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useResetEditor } from "../../hooks/use-reset-editor";
import { useProcessing } from "../../state/processing-context";

export function ErrorStage() {
  const { error, retry } = useProcessing();
  const reset = useResetEditor();
  return (
    <Alert
      tone="error"
      title="Couldn't process this image"
      action={
        <div className="flex gap-2">
          {error?.retryable && (
            <Button size="sm" onClick={retry}>
              Try again
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={reset}>
            Upload another
          </Button>
        </div>
      }
    >
      {error?.message ?? "Something went wrong."}
    </Alert>
  );
}
