"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { MAX_UPLOAD_MB } from "@/features/images/constants";
import { useImport } from "../../state/import-context";

export function UrlForm() {
  const id = useId();
  const [value, setValue] = useState("");
  const { importUrl, isImporting } = useImport();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim()) importUrl(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-[420px] flex-col justify-center gap-3.5 rounded-xl border border-input bg-card p-8">
      <h1 className="font-heading text-4xl leading-tight font-extrabold tracking-tight">Paste a link to an image.</h1>
      <label htmlFor={id} className="text-sm text-muted-foreground">
        Use a direct link to a PNG, JPEG, WebP or AVIF file, up to {MAX_UPLOAD_MB} MB.
      </label>
      <div className="flex flex-wrap gap-2.5">
        <input
          id={id}
          type="url"
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://example.com/photo.jpg"
          className="h-12 min-w-60 flex-1 rounded-full border border-input bg-background px-4 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <Button type="submit" size="lg" isLoading={isImporting}>
          Fetch image
        </Button>
      </div>
    </form>
  );
}
