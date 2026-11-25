"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils/cn";
import { useImport } from "../../state/import-context";
import { DropZone } from "./drop-zone";
import { UrlForm } from "./url-form";

type Source = "upload" | "url";
const TABS: readonly { id: Source; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "url", label: "From URL" },
];

export function EmptyStage() {
  const [source, setSource] = useState<Source>("upload");
  const { error } = useImport();
  const underlineId = useId();

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Image source" className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={source === tab.id}
            onClick={() => setSource(tab.id)}
            className={cn(
              "relative min-h-11 cursor-pointer px-3.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring",
              source === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {source === tab.id && (
              <motion.span layoutId={`source-underline-${underlineId}`} className="absolute inset-x-0 -bottom-px h-0.5 bg-brand" />
            )}
          </button>
        ))}
      </div>
      {source === "upload" ? <DropZone /> : <UrlForm />}
      {error && (
        <Alert tone="error" title="Couldn't add this image">
          {error}
        </Alert>
      )}
    </div>
  );
}
