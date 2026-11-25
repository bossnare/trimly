import { cn } from "@/lib/utils/cn";

interface PreviewImageProps {
  src: string;
  alt: string;
  className?: string;
}

/** Image that always fits its frame without cropping. */
export function PreviewImage({ src, alt, className }: PreviewImageProps) {
  // eslint-disable-next-line @next/next/no-img-element -- object URLs can't go through next/image
  return <img src={src} alt={alt} draggable={false} className={cn("h-full w-full object-contain", className)} />;
}
