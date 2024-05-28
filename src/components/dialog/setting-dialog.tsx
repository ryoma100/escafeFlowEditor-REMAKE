import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict } from "@/constants/i18n";
import { Color, useAppContext } from "@/context/app-context";
import { Theme } from "@tauri-apps/api/window";
import { Accessor, JSXElement, Setter, createEffect } from "solid-js";

export function SettingDialog(): JSXElement {
  const {
    i18n: { dict, locale, setLocale },
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useAppContext();

  function handleClose() {
    setOpenDialog(null);
  }

  return (
    <SettingDialogView
      open={openDialog()?.type === "setting"}
      dict={dict()}
      locale={locale}
      setLocale={setLocale}
      onClose={handleClose}
    />
  );
}

export function SettingDialogView(props: {
  open: boolean;
  dict: I18nDict;
  locale?: Accessor<"en" | "ja">;
  setLocale?: Setter<"en" | "ja">;
  color?: Accessor<Color>;
  setColor?: Setter<Color>;
  theme?: Accessor<Theme>;
  setTheme?: Setter<Theme>;
  onClose?: () => void;
}) {
  createEffect(() => {
    if (props.open) {
      dialogRef?.showModal();
      okButtonRef?.focus();
    } else {
      dialogRef?.close();
    }
  });

  let dialogRef: HTMLDialogElement | undefined;
  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={() => props.onClose?.()}>
      <h5 class="mb-2">{props.dict.setting}</h5>
      <form class="my-1 bg-white p-2">
        <div class="mb-4 grid grid-cols-[96px_272px] items-center">
          <div>{props.dict.language}</div>
          <div class="flex items-center gap-1">
            <input
              type="radio"
              id="i18n-en"
              name="condition"
              class="cursor-pointer"
              checked={props.locale?.() === "en"}
              onChange={() => props.setLocale?.("en")}
            />
            <label for="i18n-en" class="mr-2 cursor-pointer pl-1">
              {props.dict.en}
            </label>
            <input
              type="radio"
              id="i18n-ja"
              name="condition"
              class="cursor-pointer"
              checked={props.locale?.() === "ja"}
              onChange={() => props.setLocale?.("ja")}
            />
            <label for="i18n-ja" class="cursor-pointer pl-1">
              {props.dict.ja}
            </label>
          </div>

          <div>{props.dict.theme}</div>
          <div class="flex items-center gap-1">
            <input
              type="radio"
              id="i18n-en"
              name="condition"
              class="cursor-pointer"
              checked={props.locale?.() === "en"}
              onChange={() => props.setLocale?.("en")}
            />
            <label for="i18n-en" class="mr-2 cursor-pointer pl-1">
              {props.dict.en}
            </label>
            <input
              type="radio"
              id="i18n-ja"
              name="condition"
              class="cursor-pointer"
              checked={props.locale?.() === "ja"}
              onChange={() => props.setLocale?.("ja")}
            />
            <label for="i18n-ja" class="cursor-pointer pl-1">
              {props.dict.ja}
            </label>
          </div>
        </div>
        <ButtonsContainer>
          <button type="button" onClick={() => props.onClose?.()}>
            {props.dict.close}
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
