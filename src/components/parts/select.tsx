import type { JSX } from "solid-js";

type Props = Pick<
  JSX.IntrinsicElements["select"],
  "value" | "disabled" | "ref" | "class" | "classList" | "children"
> & {
  readonly onChange?: (
    e: Event & {
      currentTarget: HTMLSelectElement;
      target: HTMLSelectElement;
    },
  ) => void;
};

export function Select(props: Props) {
  return (
    <select
      value={props.value}
      disabled={props.disabled}
      ref={props.ref}
      class="rounded border border-primary bg-background p-1 accent-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [props.class || ""]: true, ...props.classList }}
      onChange={(e) => props.onChange?.(e)}
    >
      {props.children}
    </select>
  );
}
