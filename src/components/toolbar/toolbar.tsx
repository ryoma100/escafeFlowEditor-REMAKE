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
import "./toolbar.css";

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
    <div class="toolbar">
      <div class="toolbar__button">
        <label for="toolbar-cursor">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-cursor"
            value="cursor"
            checked={toolbar() === "cursor"}
            onChange={() => setToolbar("cursor")}
          />
          <div class="toolbar__icon" title={t("select")}>
            <PointIcon />
          </div>
        </label>
      </div>

      <div class="toolbar__button toolbar__button--margin-bottom">
        <label for="toolbar-transition">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-transition"
            value="transition"
            checked={toolbar() === "transition"}
            onChange={() => setToolbar("transition")}
          />
          <div class="toolbar__icon" title={t("transition")}>
            <LineIcon />
          </div>
        </label>
      </div>

      <div class="toolbar__button">
        <label for="toolbar-manual">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-manual"
            value="manual"
            checked={toolbar() === "addManualActivity"}
            onChange={() => setToolbar("addManualActivity")}
          />
          <div class="toolbar__icon" title={t("manualActivity")}>
            <ManualActivityIcon />
          </div>
        </label>
      </div>

      <div class="toolbar__button">
        <label for="toolbar-auto">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-auto"
            value="auto"
            checked={toolbar() === "addAutoActivity"}
            onChange={() => setToolbar("addAutoActivity")}
          />
          <div class="toolbar__icon" title={t("autoActivity")}>
            <AutoActivityIcon />
          </div>
        </label>
      </div>

      <div class="toolbar__button toolbar__button--margin-bottom">
        <label for="toolbar-hand">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-hand"
            value="hand"
            checked={toolbar() === "addUserActivity"}
            onChange={() => setToolbar("addUserActivity")}
          />
          <div class="toolbar__icon" title={t("handWork")}>
            <UserActivityIcon />
          </div>
        </label>
      </div>

      <div class="toolbar__button">
        <label for="toolbar-start">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-start"
            value="start"
            checked={toolbar() === "addStartNode"}
            onChange={() => setToolbar("addStartNode")}
          />
          <div class="toolbar__icon" title={t("start")}>
            <StartIcon />
          </div>
        </label>
      </div>

      <div class="toolbar__button">
        <label for="toolbar-end">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-end"
            value="end"
            checked={toolbar() === "addEndNode"}
            onChange={() => setToolbar("addEndNode")}
          />
          <div class="toolbar__icon" title={t("end")}>
            <EndIcon />
          </div>
        </label>
      </div>

      <div class="toolbar__button">
        <label for="toolbar-comment">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-comment"
            value="comment"
            checked={toolbar() === "addCommentNode"}
            onChange={() => setToolbar("addCommentNode")}
          />
          <div class="toolbar__icon" title={t("comment")}>
            <CommentIcon />
          </div>
        </label>
      </div>
    </div>
  );
}
