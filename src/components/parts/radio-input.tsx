import type { JSX } from "solid-js";

type Props = Pick<
  JSX.IntrinsicElements["input"],
  "id" | "name" | "value" | "disabled" | "checked" | "ref" | "class" | "classList"
> & {
  readonly onChange?: (
    e: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => void;
  readonly "data-testid"?: string;
};

export function RadioInput(props: Props) {
  return (
    <input
      type="radio"
      id={props.id}
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      checked={props.checked}
      ref={props.ref}
      data-testid={props["data-testid"]}
      class="rounded border border-primary bg-background p-1 accent-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [props.class || ""]: true, ...props.classList }}
      onChange={(e) => props.onChange?.(e)}
    />
  );
}
