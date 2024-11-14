import { createEffect, JSXElement, onMount } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";

export function AboutDialog(): JSXElement {
  const { dialogModel } = useModelContext();

  function handleClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (dialogModel.openDialog()?.type === "about") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <AboutDialogView
        version={import.meta.env.VITE_APP_VERSION ?? "v0.0.0"}
        onClose={handleClose}
      />
    </dialog>
  );
}

export function AboutDialogView(props: {
  readonly version: string;
  readonly onClose?: () => void;
}) {
  onMount(() => {
    okButtonRef?.focus();
  });

  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <div class="w-96 bg-primary p-2">
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
    </div>
  );
}
