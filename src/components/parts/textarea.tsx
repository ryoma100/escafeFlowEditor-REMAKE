import type { JSX } from "solid-js";

type Props = Pick<
  JSX.IntrinsicElements["textarea"],
  "value" | "disabled" | "readOnly" | "class" | "classList" | "children" | "ref"
> & {
  readonly onChange?: (
    e: Event & {
      currentTarget: HTMLTextAreaElement;
      target: HTMLTextAreaElement;
    },
  ) => void;
};

export function Textarea(props: Props) {
  return (
    <textarea
      value={props.value}
      disabled={props.disabled}
      readOnly={props.readOnly}
      ref={props.ref}
      class="rounded border border-primary bg-background p-1 accent-primary outline outline-primary focus:outline-3 focus:outline-primary disabled:bg-gray-400 disabled:opacity-100"
      classList={{ [props.class || ""]: true, ...props.classList }}
      onChange={(e) => props.onChange?.(e)}
    >
      {props.children}
    </textarea>
  );
}
