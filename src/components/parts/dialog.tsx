import { type JSX, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["dialog"];

export function Dialog(props: Props) {
  const [local, others] = splitProps(props, ["class", "classList", "children"]);
  return (
    <dialog
      {...others}
      class="color-foreground m-auto rounded bg-primary"
      classList={{ [local.class || ""]: true, ...local.classList }}
    >
      {local.children}
    </dialog>
  );
}
