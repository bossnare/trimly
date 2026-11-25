import type { Metadata } from "next";
import { EditorShell } from "@/features/editor/components/editor-shell";

export const metadata: Metadata = {
  title: "Editor",
  description: "Resize, convert, compress and remove the background of an image.",
};

export default function EditorPage() {
  return <EditorShell />;
}
