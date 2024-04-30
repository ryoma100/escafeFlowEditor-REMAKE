import * as i18n from "@solid-primitives/i18n";
import { JSXElement } from "solid-js";

import AutoActivitySvg from "@/assets/material-icons/auto-activity.svg";
import CommentSvg from "@/assets/material-icons/comment.svg";
import CursorSvg from "@/assets/material-icons/cursor.svg";
import EndSvg from "@/assets/material-icons/end.svg";
import ManualActivitySvg from "@/assets/material-icons/manual-activity.svg";
import StartSvg from "@/assets/material-icons/start.svg";
import TransitionSvg from "@/assets/material-icons/transition.svg";
import UserActivitySvg from "@/assets/material-icons/user-activity.svg";
import { ToggleIconButton } from "@/components/parts/toggle-icon-button";
import { useAppContext } from "@/context/app-context";

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
  const {
    diagramModel: { toolbar, setToolbar },
    i18n: { dict },
  } = useAppContext();
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
        <CursorSvg />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-transition"
        title={t("transition")}
        checked={toolbar() === "transition"}
        onChange={() => setToolbar("transition")}
        margin="0 0 16px 0"
      >
        <TransitionSvg />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-manual"
        title={t("manualActivity")}
        checked={toolbar() === "addManualActivity"}
        onChange={() => setToolbar("addManualActivity")}
        margin="0 0 8px 0"
      >
        <ManualActivitySvg />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-auto"
        title={t("autoActivity")}
        checked={toolbar() === "addAutoActivity"}
        onChange={() => setToolbar("addAutoActivity")}
        margin="0 0 8px 0"
      >
        <AutoActivitySvg />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-hand"
        title={t("handWork")}
        checked={toolbar() === "addUserActivity"}
        onChange={() => setToolbar("addUserActivity")}
        margin="0 0 16px 0"
      >
        <UserActivitySvg />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-start"
        title={t("start")}
        checked={toolbar() === "addStartNode"}
        onChange={() => setToolbar("addStartNode")}
        margin="0 0 8px 0"
      >
        <StartSvg />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-end"
        title={t("end")}
        checked={toolbar() === "addEndNode"}
        onChange={() => setToolbar("addEndNode")}
        margin="0 0 8px 0"
      >
        <EndSvg />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-comment"
        title={t("comment")}
        checked={toolbar() === "addCommentNode"}
        onChange={() => setToolbar("addCommentNode")}
      >
        <CommentSvg />
      </ToggleIconButton>
    </div>
  );
}
