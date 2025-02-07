import type { JSX } from "solid-js";

type Props = JSX.IntrinsicElements["select"];

export function Select(props: Props) {
  return (
    <select
      {...props}
      class="rounded border border-primary bg-background p-1 accent-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
    >
      {props.children}
    </select>
  );
}
