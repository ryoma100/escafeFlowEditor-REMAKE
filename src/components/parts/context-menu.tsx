import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement, createEffect, createSignal, onMount } from "solid-js";

import { defaultPoint } from "@/constants/app-const";
import { I18nDict } from "@/constants/i18n";
import { useThemeContext } from "@/context/theme-context";
import { Point, Rectangle, Size } from "@/data-source/data-type";

export function ContextMenu(props: {
  readonly openPoint: Point | null;
  readonly contextRect: Rectangle;
  readonly menuItems: (keyof I18nDict)[];
  readonly onClickMenu?: (menu: keyof I18nDict | null) => void;
}): JSXElement {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const [menuSize, setMenuSize] = createSignal<Size | null>(null);
  const [point, setPoint] = createSignal<Point>(defaultPoint);

  createEffect(() => {
    if (props.openPoint != null) {
      document.body.addEventListener("click", onBodyClick);
    } else {
      document.body.removeEventListener("click", onBodyClick);
    }
  });

  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (contextMenuRef) {
        const rect = contextMenuRef.getBoundingClientRect();
        setMenuSize({
          width: rect.width,
          height: rect.height,
        });
      }
    });
    if (contextMenuRef) {
      observer.observe(contextMenuRef);
    }
  });

  createEffect(() => {
    const contextMenuSize = menuSize();
    if (props.openPoint != null && contextMenuSize != null) {
      const x = Math.min(
        props.openPoint.x,
        props.contextRect.x + props.contextRect.width - contextMenuSize.width,
      );
      const y = Math.min(
        props.openPoint.y,
        props.contextRect.y + props.contextRect.height - contextMenuSize.height,
      );
      setPoint({ x, y });
    }
  });

  function onMenuClick(menuItem: keyof I18nDict) {
    props.onClickMenu?.(menuItem);
  }

  function onBodyClick() {
    props.onClickMenu?.(null);
  }

  let contextMenuRef: HTMLDivElement | undefined;
  return (
    <div
      ref={contextMenuRef}
      class="fixed hidden border-2 border-background bg-primary3"
      classList={{ hidden: props.openPoint == null, block: props.openPoint != null }}
      style={{ left: `${point().x}px`, top: `${point().y}px` }}
    >
      <ul class="m-1">
        <For each={props.menuItems}>
          {(it) => (
            <li
              class="cursor-pointer text-nowrap p-1 hover:bg-primary2"
              onClick={() => onMenuClick(it)}
            >
              {t(it)}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
