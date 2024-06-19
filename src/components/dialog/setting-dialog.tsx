import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { Theme, useThemeContext } from "@/context/theme-context";
import { JSXElement, createEffect } from "solid-js";

export function SettingDialog(): JSXElement {
  const {
    dialogModel: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useModelContext();

  function handleClose() {
    setOpenDialog(null);
  }

  return <SettingDialogView open={openDialog()?.type === "setting"} onClose={handleClose} />;
}

export function SettingDialogView(props: { open: boolean; onClose?: () => void }) {
  const { dict, locale, setLocale, theme, setTheme } = useThemeContext();
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
      <h5 class="mb-2">{dict().setting}</h5>
      <form class=" bg-white p-2">
        <div class="mb-4 grid grid-cols-[80px_360px] items-center gap-1">
          <div>{dict().language}</div>
          <div>
            <select
              value={locale()}
              onChange={(e) => setLocale(e.currentTarget.value as "en" | "ja")}
            >
              <option value="en">{dict().en}</option>
              <option value="ja">{dict().ja}</option>
            </select>
          </div>

          <div>{dict().theme}</div>
          <div>
            <select value={theme()} onChange={(e) => setTheme(e.currentTarget.value as Theme)}>
              <option value="material">{dict().themeMaterial}</option>
              <option value="crab">{dict().themeCrab}</option>
            </select>
          </div>
        </div>

        <ButtonsContainer>
          <button type="button" onClick={() => props.onClose?.()}>
            {dict().close}
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
