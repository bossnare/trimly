"use client";

import { AnimatePresence, motion } from "motion/react";
import { useProcessing } from "../../state/processing-context";
import { EmptyStage } from "./empty-stage";
import { ErrorStage } from "./error-stage";
import { ProcessingStage } from "./processing-stage";
import { ResultStage } from "./result-stage";

const VIEWS = {
  empty: EmptyStage,
  processing: ProcessingStage,
  result: ResultStage,
  error: ErrorStage,
} as const;

/** Central canvas. Which view shows is derived from the editor phase. */
export function Stage() {
  const { phase } = useProcessing();
  const View = VIEWS[phase];
  return (
    <main className="flex min-w-0 flex-1 flex-col items-center justify-center p-4 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] lg:overflow-y-auto lg:p-7">
      <div className="w-full max-w-[720px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={phase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            <View />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
