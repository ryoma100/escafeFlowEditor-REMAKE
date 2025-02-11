import * as i18n from "@solid-primitives/i18n";
import { type JSXElement, Show, createEffect, onMount } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { type Appearance, type Color, type Theme, useThemeContext } from "@/context/theme-context";
import { Button } from "../parts/button";
import { Dialog } from "../parts/dialog";
import { Select } from "../parts/select";

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
    <Dialog ref={dialogRef} onClose={handleClose}>
      <Show when={dialogModel.openDialog()?.type === "setting"}>
        <SettingDialogView onClose={handleClose} />
      </Show>
    </Dialog>
  );
}

export function SettingDialogView(props: { readonly onClose?: () => void }) {
  const { dict, locale, setLocale, appearance, setAppearance, theme, setTheme, color, setColor } = useThemeContext();
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
            <Select value={locale()} onChange={(e) => setLocale(e.currentTarget.value as "en" | "ja")}>
              <option value="en">{t("en")}</option>
              <option value="ja">{t("ja")}</option>
            </Select>
          </div>

          <div>{t("appearance")}</div>
          <div>
            <Select value={appearance()} onChange={(e) => setAppearance(e.currentTarget.value as Appearance)}>
              <option value="light">{t("light")}</option>
              <option value="dark">{t("dark")}</option>
              <option value="auto">{t("auto")}</option>
            </Select>
          </div>

          <div>{t("theme")}</div>
          <div>
            <Select value={theme()} onChange={(e) => setTheme(e.currentTarget.value as Theme)}>
              <option value="material">{t("themeMaterial")}</option>
              <option value="crab">{t("themeCrab")}</option>
            </Select>
          </div>

          <div>{t("color")}</div>
          <div>
            <Select value={color()} onChange={(e) => setColor(e.currentTarget.value as Color)}>
              <option value="green">{t("colorGreen")}</option>
              <option value="red">{t("colorRed")}</option>
            </Select>
          </div>
        </div>

        <ButtonsContainer>
          <Button type="button" onClick={() => props.onClose?.()}>
            {t("close")}
          </Button>
        </ButtonsContainer>
      </form>
    </div>
  );
}
