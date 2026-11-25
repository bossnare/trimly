"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEditor } from "../../state/editor-context";
import { CompressOptions } from "./compress-options";
import { ConvertOptions } from "./convert-options";
import { RemoveBackgroundOptions } from "./remove-background-options";
import { ResizeOptions } from "./resize-options";

const PANELS = {
  resize: ResizeOptions,
  convert: ConvertOptions,
  compress: CompressOptions,
  removeBackground: RemoveBackgroundOptions,
} as const;

/** Picks the right settings for the active tool. Adding a tool = one entry here. */
export function OptionsPanel() {
  const { state } = useEditor();
  const Panel = PANELS[state.tool];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={state.tool} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
        <Panel />
      </motion.div>
    </AnimatePresence>
  );
}
