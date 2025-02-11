import type { JSX } from "solid-js";

type Props = Pick<JSX.IntrinsicElements["dialog"], "ref" | "class" | "classList" | "children"> & {
  readonly onClose?: (e: Event) => void;
};

export function Dialog(props: Props) {
  return (
    <dialog
      ref={props.ref}
      class="m-auto rounded bg-primary text-foreground"
      classList={{ [props.class || ""]: true, ...props.classList }}
      onClose={(e) => props.onClose?.(e)}
    >
      {props.children}
    </dialog>
  );
}
