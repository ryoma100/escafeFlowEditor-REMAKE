import type { JSX } from "solid-js";

type Props = Pick<JSX.IntrinsicElements["input"], "min" | "max" | "step" | "value" | "ref" | "class" | "classList"> & {
  readonly onInput?: (
    e: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => void;
};

export function RangeInput(props: Props) {
  return (
    <input
      type="range"
      min={props.min}
      max={props.max}
      step={props.step}
      value={props.value}
      onInput={(e) => props.onInput?.(e)}
      ref={props.ref}
      class="rounded border border-primary bg-background p-1 accent-primary focus:outline-2 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [props.class || ""]: true, ...props.classList }}
    />
  );
}
