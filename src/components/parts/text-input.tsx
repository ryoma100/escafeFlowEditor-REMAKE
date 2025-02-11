import type { JSX } from "solid-js";

type Props = Pick<
  JSX.IntrinsicElements["input"],
  "id" | "name" | "value" | "disabled" | "class" | "classList" | "ref"
> & {
  readonly onChange?: (
    e: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => void;
  readonly onInput?: (
    e: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => void;
};

export function TextInput(props: Props) {
  return (
    <input
      type="text"
      id={props.id}
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      ref={props.ref}
      class="rounded border border-primary bg-background p-1 accent-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [props.class || ""]: true, ...props.classList }}
      onChange={(e) => props.onChange?.(e)}
      onInput={(e) => props.onChange?.(e)}
    />
  );
}
