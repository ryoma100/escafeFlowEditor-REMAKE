import * as i18n from "@solid-primitives/i18n";
import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import {
  AutoActivityIcon,
  CommentIcon,
  EndIcon,
  LineIcon,
  ManualActivityIcon,
  PointIcon,
  StartIcon,
  UserActivityIcon,
} from "../icons/material-icons";
import { ToggleIconButton } from "../parts/toggle-icon-button";

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
    diagram: { toolbar, setToolbar },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  return (
    <div class="mx-2 flex-col">
      <ToggleIconButton
        id="toolbar-select"
        title={t("select")}
        checked={toolbar() === "cursor"}
        onChange={() => setToolbar("cursor")}
        margin="0 0 4px 0"
      >
        <PointIcon />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-transition"
        title={t("transition")}
        checked={toolbar() === "transition"}
        onChange={() => setToolbar("transition")}
        margin="0 0 8px 0"
      >
        <LineIcon />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-manual"
        title={t("manualActivity")}
        checked={toolbar() === "addManualActivity"}
        onChange={() => setToolbar("addManualActivity")}
        margin="0 0 4px 0"
      >
        <ManualActivityIcon />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-auto"
        title={t("autoActivity")}
        checked={toolbar() === "addAutoActivity"}
        onChange={() => setToolbar("addAutoActivity")}
        margin="0 0 4px 0"
      >
        <AutoActivityIcon />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-hand"
        title={t("handWork")}
        checked={toolbar() === "addUserActivity"}
        onChange={() => setToolbar("addUserActivity")}
        margin="0 0 8px 0"
      >
        <UserActivityIcon />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-start"
        title={t("start")}
        checked={toolbar() === "addStartNode"}
        onChange={() => setToolbar("addStartNode")}
        margin="0 0 4px 0"
      >
        <StartIcon />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-end"
        title={t("end")}
        checked={toolbar() === "addEndNode"}
        onChange={() => setToolbar("addEndNode")}
        margin="0 0 4px 0"
      >
        <EndIcon />
      </ToggleIconButton>

      <ToggleIconButton
        id="toolbar-comment"
        title={t("comment")}
        checked={toolbar() === "addCommentNode"}
        onChange={() => setToolbar("addCommentNode")}
      >
        <CommentIcon />
      </ToggleIconButton>
    </div>
  );
}
