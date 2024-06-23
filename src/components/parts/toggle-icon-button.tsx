import { JSXElement } from "solid-js";

export function ToggleIconButton(props: {
  readonly id: string;
  readonly title: string;
  readonly checked: boolean;
  readonly name?: string;
  readonly margin?: string;
  readonly children: JSXElement;
  readonly onChange?: (e: Event) => void;
}): JSXElement {
  return (
    <div class="flex" style={{ margin: props.margin }}>
      <input
        class="
          peer/toolbar-toggle
          m-0 h-0 w-0 p-0 opacity-0"
        type="radio"
        name={props.name ?? "toggleIconButtons"}
        id={props.id}
        checked={props.checked}
        onChange={(e) => props.onChange?.(e)}
      />
      <div
        class="
          h-[52px] w-[68px]
          cursor-pointer
          rounded-md border-2
          border-primary2
          hover:bg-primary2
          peer-checked/toolbar-toggle:border-primary1
          peer-checked/toolbar-toggle:bg-primary1"
      >
        <label class="flex" for={props.id} title={props.title}>
          {props.children}
        </label>
      </div>
    </div>
  );
}
