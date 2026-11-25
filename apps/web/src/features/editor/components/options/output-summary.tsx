export function OutputSummary({ text }: { text: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4 text-sm">
      <span className="text-muted-foreground">Output</span>
      <span className="font-semibold text-brand">{text}</span>
    </div>
  );
}
