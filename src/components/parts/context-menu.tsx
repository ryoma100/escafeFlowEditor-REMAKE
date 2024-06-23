import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement, createEffect } from "solid-js";

import { I18nDict } from "@/constants/i18n";
import { useThemeContext } from "@/context/theme-context";
import { Point } from "@/data-source/data-type";

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
      class="fixed hidden bg-primary3"
      classList={{ hidden: props.openPoint == null, block: props.openPoint != null }}
      style={{ left: `${props.openPoint?.x ?? 0}px`, top: `${props.openPoint?.y ?? 0}px` }}
    >
      <ul class="m-1">
        <For each={props.menuItems}>
          {(it) => (
            <li class="cursor-pointer p-1 hover:bg-primary1" onClick={() => onMenuClick(it)}>
              {t(it)}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
