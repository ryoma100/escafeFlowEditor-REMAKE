import { type JSXElement, createSignal } from "solid-js";

const [openMenu, setOpenMenu] = createSignal<string | null>(null);

export function MenuItem(props: {
  readonly title: string;
  readonly onClick: () => void;
}): JSXElement {
  const handleClick = () => {
    setOpenMenu(null);
    props.onClick();
  };

  return (
    <li class="hover:bg-primary">
      <a class="flex items-center px-4 py-1.5" href="#" onClick={handleClick}>
        {props.title}
      </a>
    </li>
  );
}

export function Menu(props: {
  readonly title: string;
  readonly children: JSXElement;
}): JSXElement {
  const handleClick = () => {
    if (openMenu() === props.title) {
      setOpenMenu(null);
    } else {
      setOpenMenu(props.title);
    }
  };

  const handleMouseEnter = () => {
    if (openMenu() != null) {
      setOpenMenu(props.title);
    }
  };

  return (
    <li class="group relative z-10" classList={{ "bg-secondary": props.title === openMenu() }}>
      <div class="flex h-7 items-center">
        <a class="px-2 no-underline" href="#" onClick={handleClick} onMouseEnter={handleMouseEnter}>
          {props.title}
        </a>
      </div>
      <ul
        class="absolute w-max list-none border bg-secondary [border-color:var(--primary-color)]"
        classList={{ hidden: props.title !== openMenu() }}
      >
        {props.children}
      </ul>
    </li>
  );
}

export function MenuBar(props: { readonly id: string; readonly children: JSXElement }): JSXElement {
  document.addEventListener("click", (e) => {
    if (!(e.target as Element).closest(`#${props.id}`)) {
      setOpenMenu(null);
    }
  });

  return (
    <nav id={props.id} class="h-full bg-primary">
      <ul class="flex">{props.children}</ul>
    </nav>
  );
}
