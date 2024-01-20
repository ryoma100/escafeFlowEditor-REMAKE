import "./toolbar.css";

export function Toolbar() {
  return (
    <div class="toolbar">
      <div class="toolbar__button">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-cursor"
          value="cursor"
          checked={true}
        />
        <label for="toolbar-cursor">cursor</label>
      </div>
      <div class="toolbar__button toolbar__button--margin-bottom">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-transison"
          value="transison"
        />
        <label for="toolbar-transison">transison</label>
      </div>
      <div class="toolbar__button">
        <input type="radio" name="toolbar" id="toolbar-manual" value="manual" />
        <label for="toolbar-manual">manual</label>
      </div>
      <div class="toolbar__button">
        <input type="radio" name="toolbar" id="toolbar-auto" value="auto" />
        <label for="toolbar-auto">auto</label>
      </div>
      <div class="toolbar__button toolbar__button--margin-bottom">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-handmaid"
          value="handmaid"
        />
        <label for="toolbar-handmaid">hand</label>
      </div>
      <div class="toolbar__button">
        <input type="radio" name="toolbar" id="toolbar-start" value="start" />
        <label for="toolbar-start">start</label>
      </div>
      <div class="toolbar__button">
        <input type="radio" name="toolbar" id="toolbar-end" value="end" />
        <label for="toolbar-end">end</label>
      </div>
      <div class="toolbar__button">
        <input
          type="radio"
          name="toolbar"
          id="toolbar-comment"
          value="comment"
        />
        <label for="toolbar-comment">comment</label>
      </div>
    </div>
  );
}
