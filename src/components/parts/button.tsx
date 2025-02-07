import { type JSX, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["button"];

export function Button(props: Props) {
  const [local, others] = splitProps(props, ["class", "classList", "children"]);
  return (
    <button
      {...others}
      class="whitespace-nowrap rounded border-1 border-primary px-2 py-1 accent-primary hover:bg-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [local.class || ""]: true, ...local.classList }}
    >
      {props.children}
    </button>
  );
}
