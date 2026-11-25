import { DEFAULT_OPTIONS, DEFAULT_RESIZE_WIDTH } from "@/features/images/constants";
import type { SourceImage, ToolId, ToolOptionsMap } from "@/features/images/types";
import { defaultResizeTarget } from "@/features/images/utils/dimensions";

export interface EditorState {
  tool: ToolId;
  options: ToolOptionsMap;
  /** Keep the aspect ratio when editing width or height (UI-only, not sent to the API). */
  lockAspect: boolean;
  source: SourceImage | null;
}

export const initialEditorState: EditorState = {
  tool: "resize",
  options: DEFAULT_OPTIONS,
  lockAspect: true,
  source: null,
};

type PatchOptionsAction = {
  [K in ToolId]: { type: "patchOptions"; tool: K; patch: Partial<ToolOptionsMap[K]> };
}[ToolId];

export type EditorAction =
  | { type: "setTool"; tool: ToolId }
  | PatchOptionsAction
  | { type: "setLockAspect"; locked: boolean }
  | { type: "setSource"; source: SourceImage }
  | { type: "clearSource" };

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "setTool":
      return { ...state, tool: action.tool };

    case "patchOptions":
      return {
        ...state,
        options: {
          ...state.options,
          [action.tool]: { ...state.options[action.tool], ...action.patch },
        } as ToolOptionsMap,
      };

    case "setLockAspect":
      return { ...state, lockAspect: action.locked };

    case "setSource": {
      // A new image starts from a sensible resize target; other tools keep their settings.
      const { width, height } = defaultResizeTarget(action.source, DEFAULT_RESIZE_WIDTH);
      return {
        ...state,
        source: action.source,
        options: { ...state.options, resize: { ...state.options.resize, width, height } },
      };
    }

    case "clearSource":
      return {
        ...state,
        source: null,
        options: { ...state.options, resize: DEFAULT_OPTIONS.resize },
      };
  }
}
