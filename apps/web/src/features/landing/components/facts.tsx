import { FACTS } from "../content";

export function Facts() {
  return (
    <section id="numbers" className="mx-auto max-w-270 scroll-mt-24 px-5 pt-36 md:px-8">
      <dl className="border-border grid grid-cols-2 gap-y-8 border-t pt-10 lg:grid-cols-4">
        {FACTS.map((fact, index) => (
          <div
            key={fact.label}
            className={
              index === 0
                ? "pr-7"
                : index === 2
                  ? "lg:border-border pr-7 lg:border-l lg:px-7"
                  : "border-border border-l px-7"
            }
          >
            <dd className="font-heading text-[clamp(44px,6vw,72px)] leading-none font-extrabold tracking-[-0.045em]">
              {fact.value}
            </dd>
            <dt className="text-muted-foreground mt-2">{fact.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
