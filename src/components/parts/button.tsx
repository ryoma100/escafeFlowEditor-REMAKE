import { JSXElement } from "solid-js";

export function Button(props: {
  disabled?: boolean;
  onClick: (e: MouseEvent) => void;
  children: string;
}): JSXElement {
  return (
    <button
      type="button"
      onClick={(e) => props.onClick(e)}
      disabled={props.disabled}
      class="py rounded px-3 py-1"
      classList={{
        "bg-primary2 hover:bg-primary1": !props.disabled,
        "bg-gray-300": props.disabled,
      }}
    >
      {props.children}
    </button>
  );
}
