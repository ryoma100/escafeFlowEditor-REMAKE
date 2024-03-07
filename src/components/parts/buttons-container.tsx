import { JSXElement } from "solid-js";

export function ButtonsContainer(props: {
  justify?: "end";
  margin?: string;
  children: JSXElement;
}): JSXElement {
  return (
    <div
      class="flex gap-x-2"
      classList={{
        "justify-center": props.justify == null,
        "justify-end": props.justify === "end",
      }}
      style={{ margin: props.margin }}
    >
      {props.children}
    </div>
  );
}
