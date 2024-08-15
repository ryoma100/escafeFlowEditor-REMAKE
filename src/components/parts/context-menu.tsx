import * as i18n from "@solid-primitives/i18n";
import { createEffect, createSignal, For, JSXElement, onMount } from "solid-js";

import { defaultPoint } from "@/constants/app-const";
import { I18nDict } from "@/constants/i18n";
import { useThemeContext } from "@/context/theme-context";
import { Point, Size } from "@/data-source/data-type";

export function ContextMenu(props: {
  readonly openPoint: Point | null;
  readonly menuItems: (keyof I18nDict)[];
  readonly onClickMenu?: (menu: keyof I18nDict | null) => void;
}): JSXElement {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  createEffect(() => {
    if (props.openPoint != null) {
      document.body.addEventListener("click", onBodyClick);
    } else {
      document.body.removeEventListener("click", onBodyClick);
    }
  });

  const [menuSize, setMenuSize] = createSignal<Size | null>(null);
  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (contextMenuRef) {
        const rect = contextMenuRef.getBoundingClientRect();
        setMenuSize({ width: rect.width, height: rect.height });
      }
    });
    if (contextMenuRef) {
      observer.observe(contextMenuRef);
    }
  });

  const [adjustPoint, setAdjustPoint] = createSignal<Point>(defaultPoint);
  createEffect(() => {
    const contextMenuSize = menuSize();
    if (props.openPoint != null && contextMenuSize != null) {
      const x = Math.min(props.openPoint.x, document.body.clientWidth - contextMenuSize.width);
      const y = Math.min(props.openPoint.y, document.body.clientHeight - contextMenuSize.height);
      setAdjustPoint({ x, y });
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
      class="fixed hidden border-2 border-background bg-secondary"
      classList={{ hidden: props.openPoint == null, block: props.openPoint != null }}
      style={{ left: `${adjustPoint().x}px`, top: `${adjustPoint().y}px` }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <ul class="m-1">
        <For each={props.menuItems}>
          {(it) => (
            <li
              class="cursor-pointer text-nowrap p-1 hover:bg-primary"
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
