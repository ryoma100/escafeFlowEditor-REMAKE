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
      class={props.class}
      classList={props.classList}
      onChange={(e) => props.onChange?.(e)}
    />
  );
}
