import { type JSX, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["textarea"];

export function Textarea(props: Props) {
  const [local, others] = splitProps(props, ["class", "classList"]);
  return (
    <textarea
      {...others}
      class="rounded border border-primary bg-background p-1 accent-primary outline outline-primary focus:outline-3 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [local.class || ""]: true, ...local.classList }}
    />
  );
}
