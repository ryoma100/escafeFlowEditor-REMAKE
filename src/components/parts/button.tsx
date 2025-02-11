import type { JSX } from "solid-js";

type Props = Pick<JSX.IntrinsicElements["button"], "type" | "disabled" | "class" | "classList" | "children"> & {
  onClick?: (e: MouseEvent) => void;
};

export function Button(props: Props) {
  return (
    <button
      type={props.type}
      disabled={props.disabled}
      class="whitespace-nowrap rounded border-1 border-primary px-2 py-1 accent-primary hover:bg-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [props.class || ""]: true, ...props.classList }}
      onClick={(e) => props.onClick?.(e)}
    >
      {props.children}
    </button>
  );
}
