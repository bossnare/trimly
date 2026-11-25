import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "./section-heading";

export function ClosingPanel() {
  return (
    <section className="mx-auto max-w-[1080px] px-5 pt-36 md:px-8">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[32px] border border-input bg-card px-6 py-24 text-center">
        <div aria-hidden className="glow pointer-events-none absolute -top-[40%] left-1/2 h-[560px] w-[760px] max-w-full -translate-x-1/2" />
        <SectionHeading className="relative max-w-[680px]">Try it on your own image.</SectionHeading>
        <p className="relative max-w-[440px] text-lg leading-normal text-muted-foreground">
          Open the editor, add a file or a link and see the result before you download.
        </p>
        <ButtonLink href="/editor" size="lg" className="relative">
          Open the editor
        </ButtonLink>
      </div>
    </section>
  );
}
