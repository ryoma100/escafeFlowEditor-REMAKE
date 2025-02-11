import type { JSX } from "solid-js";

type Props = Pick<
  JSX.IntrinsicElements["button"],
  "type" | "disabled" | "onClick" | "class" | "classList" | "children"
>;

export function Button(props: Props) {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      class="whitespace-nowrap rounded border-1 border-primary px-2 py-1 accent-primary hover:bg-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [props.class || ""]: true, ...props.classList }}
    >
      {props.children}
    </button>
  );
}
