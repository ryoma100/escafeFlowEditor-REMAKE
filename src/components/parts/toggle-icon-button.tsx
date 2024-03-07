import { JSXElement } from "solid-js";

export function ToggleIconButton(props: {
  id: string;
  title: string;
  checked: boolean;
  name?: string;
  margin?: string;
  onChange: (e: Event) => void;
  children: JSXElement;
}): JSXElement {
  return (
    <div class="flex" style={{ margin: props.margin }}>
      <label class="flex" for={props.id}>
        <input
          class="
            peer/tool-toggle
            m-0 h-0 w-0"
          type="radio"
          name={props.name ?? "toggleIconButtons"}
          id={props.id}
          checked={props.checked}
          onChange={(e) => props.onChange(e)}
        />
        <div
          class="
            h-[52px] w-[68px]
            cursor-pointer
            items-center justify-center rounded-md border-2
            border-primary2 pl-2 pt-2
            hover:bg-primary2
            peer-checked/tool-toggle:bg-primary1"
          title={props.title}
        >
          {props.children}
        </div>
      </label>
    </div>
  );
}
