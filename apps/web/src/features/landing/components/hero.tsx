"use client";

import { motion, type Variants } from "motion/react";
import { ButtonLink } from "@/components/ui/button-link";
import { FORMATS, MAX_UPLOAD_MB } from "@/features/images/constants";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Hero() {
  const formats = FORMATS.map((f) => f.label);
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-[1080px] flex-col items-center gap-7 px-5 pt-24 text-center md:px-8"
    >
      <motion.p variants={item} className="inline-flex items-center gap-2.5 rounded-full border border-input bg-card px-4 py-2 text-sm text-muted-foreground">
        <span aria-hidden className="size-2 rounded-full bg-brand" />
        Four image tools in one tab
      </motion.p>
      <motion.h1 variants={item} className="text-gradient max-w-[900px] font-heading text-[clamp(46px,8.4vw,104px)] leading-[0.96] font-extrabold tracking-[-0.05em]">
        Trim every image to size.
      </motion.h1>
      <motion.p variants={item} className="max-w-[560px] text-[19px] leading-relaxed text-muted-foreground">
        Resize, convert, compress and cut out the background. Add a file or paste a link, check the result against the original, then download.
      </motion.p>
      <motion.div variants={item} className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/editor" size="lg">
          Open the editor
        </ButtonLink>
        <ButtonLink href="#tools" variant="outline" size="lg">
          See the tools
        </ButtonLink>
      </motion.div>
      <motion.p variants={item} className="text-sm text-muted-foreground">
        {formats.slice(0, -1).join(", ")} and {formats.at(-1)}, up to {MAX_UPLOAD_MB} MB per image.
      </motion.p>
    </motion.section>
  );
}
