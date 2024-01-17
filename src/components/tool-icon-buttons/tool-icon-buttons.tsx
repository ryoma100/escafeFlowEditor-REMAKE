import "./tool-icon-buttons.css";

export function ToolIconButtons() {
  return (
    <div class="tool-icon-buttons">
      <div class="title"></div>
      <div>
        <input
          type="radio"
          name="tool"
          id="tool-cursor"
          value="cursor"
          checked={true}
        />
        <label for="tool-cursor">cursor</label>
      </div>
      <div>
        <input type="radio" name="tool" id="tool-transison" value="transison" />
        <label for="tool-transison">transison</label>
      </div>
      <div>
        <input type="radio" name="tool" id="tool-manual" value="manual" />
        <label for="tool-manual">manual</label>
      </div>
      <div>
        <input type="radio" name="tool" id="tool-auto" value="auto" />
        <label for="tool-auto">auto</label>
      </div>
      <div>
        <input type="radio" name="tool" id="tool-handmaid" value="handmaid" />
        <label for="tool-handmaid">hand</label>
      </div>
      <div>
        <input type="radio" name="tool" id="tool-start" value="start" />
        <label for="tool-start">start</label>
      </div>
      <div>
        <input type="radio" name="tool" id="tool-end" value="end" />
        <label for="tool-end">end</label>
      </div>
      <div>
        <input type="radio" name="tool" id="tool-comment" value="comment" />
        <label for="tool-comment">comment</label>
      </div>
    </div>
  );
}
