import { createEffect, JSXElement } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";

export function AboutDialog(): JSXElement {
  const {
    dialogModel: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useModelContext();

  function handleClose() {
    setOpenDialog(null);
  }

  return (
    <AboutDialogView
      open={openDialog()?.type === "about"}
      version={import.meta.env.VITE_APP_VERSION ?? "v0.0.0"}
      onClose={handleClose}
    />
  );
}

export function AboutDialogView(props: {
  readonly open: boolean;
  readonly version: string;
  readonly onClose?: () => void;
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
    <dialog class="w-96 bg-primary p-2" ref={dialogRef} onClose={() => props.onClose?.()}>
      <h5 class="mb-2">escafeFlowEditor-REMAKE</h5>
      <form class="my-1 bg-background p-2" onClick={() => props.onClose?.()}>
        <div>version: {props.version.substring(1)}</div>
        <div>author: Ryouichi Matsuda</div>
        <div class="mb-4">
          <a
            href="https://github.com/ryoma100/escafeFlowEditor-REMAKE"
            class="underline"
            target="_blank"
          >
            https://github.com/ryoma100/escafeFlowEditor-REMAKE/
          </a>
        </div>

        <ButtonsContainer>
          <button type="submit" ref={okButtonRef}>
            OK
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
