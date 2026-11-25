import { STEPS } from "../content";
import { SectionHeading } from "./section-heading";

export function Steps() {
  return (
    <section id="how" className="mx-auto max-w-[1080px] scroll-mt-24 px-5 pt-36 md:px-8">
      <SectionHeading className="mb-14 max-w-[620px]">From file to download in three moves.</SectionHeading>
      <ol className="grid gap-8 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-input bg-card font-semibold text-brand">{index + 1}</span>
              {index < STEPS.length - 1 && <span aria-hidden className="h-px flex-1 bg-input max-lg:hidden" />}
            </div>
            <h3 className="font-heading text-2xl font-semibold tracking-tight">{step.title}</h3>
            <p className="max-w-[320px] leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
