import type { JSX } from "solid-js";

type Props = Pick<JSX.IntrinsicElements["dialog"], "ref" | "onClose" | "class" | "classList" | "children">;

export function Dialog(props: Props) {
  return (
    <dialog
      ref={props.ref}
      onClose={props.onClose}
      class="m-auto rounded bg-primary text-foreground"
      classList={{ [props.class || ""]: true, ...props.classList }}
    >
      {props.children}
    </dialog>
  );
}
