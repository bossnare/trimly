import { Upload } from "lucide-react";
import { SampleScene } from "@/components/shared/sample-scene";
import { buttonVariants } from "@/components/ui/button";
import { FORMATS, MAX_UPLOAD_MB } from "@/features/images/constants";
import { FitDemo } from "./fit-demo";
import { QualityDemo } from "./quality-demo";
import { SectionHeading } from "./section-heading";
import { Tile } from "./tile";

export function ToolsBento() {
  return (
    <section id="tools" className="mx-auto max-w-[1080px] scroll-mt-24 px-5 pt-36 md:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading className="max-w-[560px]">Four tools, tuned for the details.</SectionHeading>
        <p className="max-w-[380px] text-[17px] leading-relaxed text-muted-foreground">
          Every control maps to something your image needs: its size, its format, its weight or its background.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <Tile
          className="lg:col-span-4"
          title="Five ways to fit"
          description="Cover, contain, fill, inside and outside decide how an image meets the size you set. Pick one to see what it does."
        >
          <FitDemo />
        </Tile>
        <Tile className="lg:col-span-2" title="Four formats" description="Convert to the one that fits where the image is going.">
          <ul className="overflow-hidden rounded-2xl border border-border bg-background">
            {FORMATS.map((format, index) => (
              <li key={format.id} className={index === 0 ? "px-4 py-3" : "border-t border-border px-4 py-3"}>
                <p className="font-semibold">{format.label}</p>
                <p className="text-sm text-muted-foreground">{format.note}</p>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile
          className="lg:col-span-2"
          title="Quality starts at 80%"
          description="A balanced default and one slider to change it. PNG is lossless, so it never shows a quality slider."
        >
          <QualityDemo />
        </Tile>
        <Tile
          className="lg:col-span-3"
          title="Cut the subject out"
          description="Replace the background with transparency, white or a color of your own. The result is a PNG."
        >
          <div className="checkerboard h-[200px] overflow-hidden rounded-2xl border border-border">
            <SampleScene variant="cutout" />
          </div>
        </Tile>
        <Tile className="lg:col-span-3" title="A file or a link" description={`Drop an image from your device or paste its address. Either way, up to ${MAX_UPLOAD_MB} MB.`}>
          <div className="flex h-[200px] flex-col justify-center gap-3 rounded-2xl border border-border bg-background p-4" aria-hidden>
            <div className="flex items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-input p-4 text-muted-foreground">
              <Upload className="size-5" />
              Drop an image here
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl border border-input py-1.5 pr-1.5 pl-3.5 text-sm text-muted-foreground">
              <span className="truncate">https://example.com/photo.jpg</span>
              <span className={buttonVariants({ size: "sm", className: "h-9 shrink-0" })}>Fetch image</span>
            </div>
          </div>
        </Tile>
      </div>
    </section>
  );
}
