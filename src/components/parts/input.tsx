import { type JSX, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["input"];

export function Input(props: Props) {
  const [local, others] = splitProps(props, ["class", "classList"]);
  return (
    <input
      {...others}
      class="rounded border border-primary bg-background p-1 accent-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [local.class || ""]: true, ...local.classList }}
    />
  );
}
