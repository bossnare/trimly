"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { SourceImage, ToolId, ToolOptionsMap } from "@/features/images/types";
import { editorReducer, initialEditorState, type EditorAction, type EditorState } from "./editor-state";

interface EditorActions {
  setTool: (tool: ToolId) => void;
  patchOptions: <T extends ToolId>(tool: T, patch: Partial<ToolOptionsMap[T]>) => void;
  setLockAspect: (locked: boolean) => void;
  setSource: (source: SourceImage) => void;
  clearSource: () => void;
}

interface EditorContextValue {
  state: EditorState;
  actions: EditorActions;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);

  const actions = useMemo<EditorActions>(
    () => ({
      setTool: (tool) => dispatch({ type: "setTool", tool }),
      patchOptions: (tool, patch) => dispatch({ type: "patchOptions", tool, patch } as EditorAction),
      setLockAspect: (locked) => dispatch({ type: "setLockAspect", locked }),
      setSource: (source) => dispatch({ type: "setSource", source }),
      clearSource: () => dispatch({ type: "clearSource" }),
    }),
    [],
  );

  // Release the original image's object URL when it is replaced or the editor unmounts.
  const objectUrl = state.source?.objectUrl;
  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor must be used inside <EditorProvider>");
  return context;
}
