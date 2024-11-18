import * as i18n from "@solid-primitives/i18n";
import { createEffect, JSXElement, onMount, Show } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { Appearance, Color, Theme, useThemeContext } from "@/context/theme-context";

export function SettingDialog(): JSXElement {
  const { dialogModel } = useModelContext();

  function handleClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (dialogModel.openDialog()?.type === "setting") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <Show when={dialogModel.openDialog()?.type === "setting"}>
        <SettingDialogView onClose={handleClose} />
      </Show>
    </dialog>
  );
}

export function SettingDialogView(props: { readonly onClose?: () => void }) {
  const { dict, locale, setLocale, appearance, setAppearance, theme, setTheme, color, setColor } =
    useThemeContext();
  const t = i18n.translator(dict);

  onMount(() => {
    okButtonRef?.focus();
  });

  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <div class="bg-primary p-2">
      <h5 class="mb-2">{t("setting")}</h5>
      <form class="bg-background p-2">
        <div class="mb-4 grid grid-cols-[80px_360px] items-center gap-1">
          <div>{t("language")}</div>
          <div>
            <select
              value={locale()}
              onChange={(e) => setLocale(e.currentTarget.value as "en" | "ja")}
            >
              <option value="en">{t("en")}</option>
              <option value="ja">{t("ja")}</option>
            </select>
          </div>

          <div>{t("appearance")}</div>
          <div>
            <select
              value={appearance()}
              onChange={(e) => setAppearance(e.currentTarget.value as Appearance)}
            >
              <option value="light">{t("light")}</option>
              <option value="dark">{t("dark")}</option>
              <option value="auto">{t("auto")}</option>
            </select>
          </div>

          <div>{t("theme")}</div>
          <div>
            <select value={theme()} onChange={(e) => setTheme(e.currentTarget.value as Theme)}>
              <option value="material">{t("themeMaterial")}</option>
              <option value="crab">{t("themeCrab")}</option>
            </select>
          </div>

          <div>{t("color")}</div>
          <div>
            <select value={color()} onChange={(e) => setColor(e.currentTarget.value as Color)}>
              <option value="green">{t("colorGreen")}</option>
              <option value="red">{t("colorRed")}</option>
            </select>
          </div>
        </div>

        <ButtonsContainer>
          <button type="button" onClick={() => props.onClose?.()}>
            {t("close")}
          </button>
        </ButtonsContainer>
      </form>
    </div>
  );
}
