"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { useEditor } from "../state/editor-context";
import { TOOLS } from "../tool-meta";

export function ToolRail() {
  const { state, actions } = useEditor();
  return (
    <nav
      aria-label="Tools"
      className="border-border flex shrink-0 gap-1 overflow-x-auto border-b p-3 lg:w-60 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0"
    >
      {TOOLS.map(({ id, label, icon: Icon }) => {
        const active = state.tool === id;
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() => actions.setTool(id)}
            className={cn(
              "focus-visible:outline-ring relative flex min-h-12 shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3.5 font-semibold whitespace-nowrap transition-colors focus-visible:outline-2",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="tool-rail-active"
                className="bg-muted absolute inset-0 rounded-xl shadow-[inset_3px_0_0_var(--brand)]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <Icon aria-hidden className="relative size-5 shrink-0" />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
