"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { ACCEPT_ATTRIBUTE } from "@/features/images/constants";
import { useImportImage } from "../hooks/use-import-image";
import { useEditor } from "./editor-context";

interface ImportContextValue {
  importFile: (file: File) => void;
  importUrl: (url: string) => void;
  isImporting: boolean;
  error: string | null;
  resetImport: () => void;
  /** Opens the native file chooser from anywhere (drop zone, CTA, top bar). */
  openFilePicker: () => void;
}

const ImportContext = createContext<ImportContextValue | null>(null);

/** Owns the hidden file input and the import mutations so any component can start an import. */
export function ImportProvider({ children }: { children: ReactNode }) {
  const { actions } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);
  const { importFile, importUrl, isPending, error, reset } = useImportImage(actions.setSource);

  const openFilePicker = useCallback(() => inputRef.current?.click(), []);

  const value = useMemo<ImportContextValue>(
    () => ({ importFile, importUrl, isImporting: isPending, error, resetImport: reset, openFilePicker }),
    [importFile, importUrl, isPending, error, reset, openFilePicker],
  );

  return (
    <ImportContext.Provider value={value}>
      {children}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) importFile(file);
          event.target.value = ""; // allows choosing the same file again
        }}
      />
    </ImportContext.Provider>
  );
}

export function useImport(): ImportContextValue {
  const context = useContext(ImportContext);
  if (!context) throw new Error("useImport must be used inside <ImportProvider>");
  return context;
}
