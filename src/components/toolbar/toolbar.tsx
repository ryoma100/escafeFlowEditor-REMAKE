import { JSXElement } from "solid-js";
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
        <input
          type="radio"
          name="toolbar"
          id="toolbar-cursor"
          value="cursor"
          checked={toolbar() === "cursor"}
          onChange={() => setToolbar("cursor")}
        />
        <label for="toolbar-cursor">cursor</label>
      </div>
      <div class="toolbar__button toolbar__button--margin-bottom">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-transison"
          value="transison"
          checked={toolbar() === "transion"}
          onChange={() => setToolbar("transion")}
        />
        <label for="toolbar-transison">transison</label>
      </div>
      <div class="toolbar__button">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-manual"
          value="manual"
          checked={toolbar() === "manual"}
          onChange={() => setToolbar("manual")}
        />
        <label for="toolbar-manual">manual</label>
      </div>
      <div class="toolbar__button">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-auto"
          value="auto"
          checked={toolbar() === "auto"}
          onChange={() => setToolbar("auto")}
        />
        <label for="toolbar-auto">auto</label>
      </div>
      <div class="toolbar__button toolbar__button--margin-bottom">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-hand"
          value="hand"
          checked={toolbar() === "hand"}
          onChange={() => setToolbar("hand")}
        />
        <label for="toolbar-hand">hand</label>
      </div>
      <div class="toolbar__button">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-start"
          value="start"
          checked={toolbar() === "start"}
          onChange={() => setToolbar("start")}
        />
        <label for="toolbar-start">start</label>
      </div>
      <div class="toolbar__button">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-end"
          value="end"
          checked={toolbar() === "end"}
          onChange={() => setToolbar("end")}
        />
        <label for="toolbar-end">end</label>
      </div>
      <div class="toolbar__button">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-comment"
          value="comment"
          checked={toolbar() === "comment"}
          onChange={() => setToolbar("comment")}
        />
        <label for="toolbar-comment">comment</label>
      </div>
    </div>
  );
}
