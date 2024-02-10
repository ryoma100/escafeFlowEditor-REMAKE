import { JSXElement } from "solid-js";
import ArrowIcon from "../../assets/material-icons/arrow_selector_tool_FILL0_wght400_GRAD0_opsz24.svg";
import CommentIcon from "../../assets/material-icons/comment_FILL0_wght400_GRAD0_opsz24.svg";
import AutoIcon from "../../assets/material-icons/computer_FILL0_wght400_GRAD0_opsz24.svg";
import LineIcon from "../../assets/material-icons/north_east_FILL0_wght400_GRAD0_opsz24.svg";
import HandIcon from "../../assets/material-icons/pan_tool_FILL0_wght400_GRAD0_opsz24.svg";
import ManualIcon from "../../assets/material-icons/person_check_FILL0_wght400_GRAD0_opsz24.svg";
import StratIcon from "../../assets/material-icons/play_arrow_FILL0_wght400_GRAD0_opsz24.svg";
import EndIcon from "../../assets/material-icons/stop_FILL0_wght400_GRAD0_opsz24.svg";
import { useAppContext } from "../../context/app-context";
import "./toolbar.css";

export type ToolbarType =
  | "cursor"
  | "transion"
  | "manual"
  | "auto"
  | "hand"
  | "start"
  | "end"
  | "comment";

export function Toolbar(): JSXElement {
  const {
    diagram: { toolbar, setToolbar },
  } = useAppContext();

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
          <div>
            <ArrowIcon />
          </div>
        </label>
      </div>

      <div class="toolbar__button toolbar__button--margin-bottom">
        <label for="toolbar-transison">
          <input
            type="radio"
            name="toolbar"
            id="toolbar-transison"
            value="transison"
            checked={toolbar() === "transion"}
            onChange={() => setToolbar("transion")}
          />
          <div>
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
            checked={toolbar() === "manual"}
            onChange={() => setToolbar("manual")}
          />
          <div>
            <ManualIcon />
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
            checked={toolbar() === "auto"}
            onChange={() => setToolbar("auto")}
          />
          <div>
            <AutoIcon />
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
            checked={toolbar() === "hand"}
            onChange={() => setToolbar("hand")}
          />
          <div>
            <HandIcon />
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
            checked={toolbar() === "start"}
            onChange={() => setToolbar("start")}
          />
          <div>
            <StratIcon />
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
            checked={toolbar() === "end"}
            onChange={() => setToolbar("end")}
          />
          <div>
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
            checked={toolbar() === "comment"}
            onChange={() => setToolbar("comment")}
          />
          <div>
            <CommentIcon />
          </div>
        </label>
      </div>
    </div>
  );
}
