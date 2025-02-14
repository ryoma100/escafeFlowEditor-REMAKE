import type { JSXElement } from "solid-js";

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
        type="radio"
        class="peer/toolbar-toggle m-0 size-0 p-0 opacity-0"
        name={props.name ?? "toggleIconButtons"}
        id={props.id}
        checked={props.checked}
        onChange={(e) => props.onChange?.(e)}
      />
      <div class="h-[52px] w-[68px] rounded-md border-2 border-primary bg-secondary hover:bg-primary peer-checked/toolbar-toggle:border-primary peer-checked/toolbar-toggle:bg-primary">
        <label class="flex cursor-pointer" for={props.id} title={props.title}>
          {props.children}
        </label>
      </div>
    </div>
  );
}
