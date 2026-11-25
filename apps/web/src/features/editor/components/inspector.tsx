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
      className="flex flex-col w-full gap-5 p-5 pb-0 overflow-x-hidden border-t bg-card border-border lg:w-86 lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-l"
    >
      <header className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight font-heading">{tool.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
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
