"use client";

import { EditorProvider } from "../state/editor-context";
import { ImportProvider } from "../state/import-context";
import { ProcessingProvider } from "../state/processing-context";
import { EditorTopbar } from "./editor-topbar";
import { Inspector } from "./inspector";
import { MobileDownloadBar } from "./mobile-download-bar";
import { Stage } from "./stage/stage";
import { ToolRail } from "./tool-rail";

/** Composition root of the editor: providers first, then the three-column layout. */
export function EditorShell() {
  return (
    <EditorProvider>
      <ImportProvider>
        <ProcessingProvider>
          <div className="flex min-h-dvh flex-col lg:h-dvh">
            <EditorTopbar />
            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              <ToolRail />
              <Stage />
              <Inspector />
            </div>
            <MobileDownloadBar />
          </div>
        </ProcessingProvider>
      </ImportProvider>
    </EditorProvider>
  );
}
