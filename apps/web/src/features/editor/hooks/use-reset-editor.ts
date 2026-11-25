import { useCallback } from "react";
import { useEditor } from "../state/editor-context";
import { useImport } from "../state/import-context";

/** Back to the empty state: drops the image and any pending import. */
export function useResetEditor() {
  const { actions } = useEditor();
  const { resetImport } = useImport();
  return useCallback(() => {
    resetImport();
    actions.clearSource();
  }, [actions, resetImport]);
}
