import * as i18n from "@solid-primitives/i18n";
import { JSXElement } from "solid-js";

import { ToggleIconButton } from "@/components/parts/toggle-icon-button";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { AutoActivityIcon } from "@/icons/auto-activity-icon";
import { CommentIcon } from "@/icons/comment";
import { CursorIcon } from "@/icons/cursor-icon";
import { EndIcon } from "@/icons/end-icon";
import { ManualActivityIcon } from "@/icons/manual-activity-icon";
import { StartIcon } from "@/icons/start-icon";
import { TransitionIcon } from "@/icons/transition-icon";
import { UserActivityIcon } from "@/icons/user-activity-icon";

export type ToolbarType =
  | "cursor"
  | "transition"
  | "addManualActivity"
  | "addAutoActivity"
  | "addUserActivity"
  | "addStartNode"
  | "addEndNode"
  | "addCommentNode";

export function Toolbar(): JSXElement {
  const { dict } = useThemeContext();
  const {
    diagramModel: { toolbar, setToolbar },
  } = useModelContext();
  const t = i18n.translator(dict);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      setToolbar("cursor");
    }
  }

  return (
    <div class="mx-2 flex-col outline-none" onKeyDown={handleKeyDown}>
      <ToggleIconButton
        id="toolbar-cursor"
        title={t("select")}
        checked={toolbar() === "cursor"}
        onChange={() => setToolbar("cursor")}
        margin="4px 0 8px 0"
      >
        <CursorIcon class="[fill:var(--foreground-color)]" />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-transition"
        title={t("transition")}
        checked={toolbar() === "transition"}
        onChange={() => setToolbar("transition")}
        margin="0 0 16px 0"
      >
        <TransitionIcon class="[fill:var(--foreground-color)]" />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-manual"
        title={t("manualActivity")}
        checked={toolbar() === "addManualActivity"}
        onChange={() => setToolbar("addManualActivity")}
        margin="0 0 8px 0"
      >
        <ManualActivityIcon class="[fill:var(--foreground-color)]" />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-auto"
        title={t("autoActivity")}
        checked={toolbar() === "addAutoActivity"}
        onChange={() => setToolbar("addAutoActivity")}
        margin="0 0 8px 0"
      >
        <AutoActivityIcon class="[fill:var(--foreground-color)]" />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-hand"
        title={t("handWork")}
        checked={toolbar() === "addUserActivity"}
        onChange={() => setToolbar("addUserActivity")}
        margin="0 0 16px 0"
      >
        <UserActivityIcon class="[fill:var(--foreground-color)]" />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-start"
        title={t("start")}
        checked={toolbar() === "addStartNode"}
        onChange={() => setToolbar("addStartNode")}
        margin="0 0 8px 0"
      >
        <div class="flex h-12 w-16 items-center justify-center">
          <StartIcon class="[fill:var(--foreground-color)]" />
        </div>
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-end"
        title={t("end")}
        checked={toolbar() === "addEndNode"}
        onChange={() => setToolbar("addEndNode")}
        margin="0 0 8px 0"
      >
        <div class="flex h-12 w-16 items-center justify-center">
          <EndIcon class="[fill:var(--foreground-color)]" />
        </div>
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-comment"
        title={t("comment")}
        checked={toolbar() === "addCommentNode"}
        onChange={() => setToolbar("addCommentNode")}
      >
        <div class="flex h-12 w-16 items-center justify-center">
          <CommentIcon class="[fill:var(--foreground-color)]" />
        </div>
      </ToggleIconButton>
    </div>
  );
}
