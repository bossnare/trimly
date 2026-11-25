"use client";

import { cn } from "@/lib/utils/cn";
import { useEditor } from "../state/editor-context";
import { useProcessing } from "../state/processing-context";
import { TOOL_BY_ID } from "../tool-meta";
import { ActionButton } from "./action-button";
import { OptionsPanel } from "./options/options-panel";

export function Inspector() {
  const { state } = useEditor();
  const { phase } = useProcessing();
  const tool = TOOL_BY_ID[state.tool];
  return (
    <aside
      aria-label="Settings"
      className="border-border bg-card flex w-full flex-col gap-5 border-t p-5 lg:w-86 lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-l"
    >
      <header className="space-y-1.5">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">{tool.title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
      </header>
      <OptionsPanel />
      {/* On small screens the sticky download bar replaces this button once there is a result. */}
      <div
        className={cn(
          "border-border bg-card sticky bottom-0 -mx-5 mt-auto -mb-5 border-t p-5",
          phase === "result" && "max-lg:hidden",
        )}
      >
        <ActionButton />
      </div>
    </aside>
  );
}
