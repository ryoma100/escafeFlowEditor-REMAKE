import type { JSX } from "solid-js";

type Props = Pick<
  JSX.IntrinsicElements["select"],
  "value" | "onChange" | "disabled" | "class" | "classList" | "ref" | "children"
>;

export function Select(props: Props) {
  return (
    <select
      value={props.value}
      onChange={props.onChange}
      ref={props.ref}
      class="rounded border border-primary bg-background p-1 accent-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [props.class || ""]: true, ...props.classList }}
    >
      {props.children}
    </select>
  );
}
