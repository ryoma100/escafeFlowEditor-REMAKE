import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict } from "@/constants/i18n";
import { Color, Theme, useAppContext } from "@/context/app-context";
import { Accessor, JSXElement, Setter, createEffect } from "solid-js";

export function SettingDialog(): JSXElement {
  const {
    i18n: { dict, locale, setLocale, theme, setTheme },
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
      theme={theme}
      setTheme={setTheme}
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
    <dialog class="bg-primary2 p-2" ref={dialogRef} onClose={() => props.onClose?.()}>
      <h5 class="mb-2">{props.dict.setting}</h5>
      <form class=" bg-white p-2">
        <div class="mb-4 grid grid-cols-[80px_360px] items-center gap-1">
          <div>{props.dict.language}</div>
          <div>
            <select
              value={props.locale?.()}
              onChange={(e) => props.setLocale?.(e.currentTarget.value as "en" | "ja")}
            >
              <option value="en">{props.dict.en}</option>
              <option value="ja">{props.dict.ja}</option>
            </select>
          </div>

          <div>{props.dict.theme}</div>
          <div>
            <select
              value={props.theme?.()}
              onChange={(e) => props.setTheme?.(e.currentTarget.value as Theme)}
            >
              <option value="material">{props.dict.themeMaterial}</option>
              <option value="crab">{props.dict.themeCrab}</option>
            </select>
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
