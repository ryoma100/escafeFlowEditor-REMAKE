import type { JSXElement } from "solid-js";

export function ButtonsContainer(props: {
  readonly justify?: "end" | "start";
  readonly margin?: string;
  readonly children: JSXElement;
}): JSXElement {
  return (
    <div
      class="flex gap-x-2"
      classList={{
        "justify-center": props.justify == null,
        "justify-start": props.justify === "start",
        "justify-end": props.justify === "end",
      }}
      style={{ margin: props.margin }}
    >
      {props.children}
    </div>
  );
}
