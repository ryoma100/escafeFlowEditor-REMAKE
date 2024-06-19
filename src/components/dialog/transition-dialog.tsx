import { JSXElement, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict } from "@/constants/i18n";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ModalDialogType } from "@/data-model/dialog-model";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { TransitionEdge } from "@/data-source/data-type";

const dummy = dataFactory.createTransitionEdge([], 0, 0);

export function TransitionDialog(): JSXElement {
  const { dict } = useThemeContext();
  const {
    dialogModel: {
      modalDialog: openDialog,
      setModalDialog: setOpenDialog,
      setMessageAlert: setOpenMessageDialog,
    },
    transitionEdgeModel: { updateTransitionEdge },
  } = useModelContext();

  function handleFormSubmit(formData: TransitionEdge) {
    const errorMessage = updateTransitionEdge(formData);
    if (errorMessage) {
      setOpenMessageDialog(errorMessage);
      return;
    }
    setOpenDialog(null);
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <TransitionDialogView
      openDialog={openDialog()}
      dict={dict()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function TransitionDialogView(props: {
  openDialog: ModalDialogType | null;
  dict: I18nDict;
  onFormSubmit?: (formData: TransitionEdge) => void;
  onDialogClose?: () => void;
}) {
  const [formData, setFormData] = createStore<TransitionEdge>(dummy);
  const [showOgnl, setShowOgnl] = createSignal<boolean>(false);

  createEffect(() => {
    if (props.openDialog?.type === "transition") {
      const transition = deepUnwrap(props.openDialog.transition);
      setFormData(transition);
      setShowOgnl(transition.ognl !== "");
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    const transition = deepUnwrap(formData);
    if (!showOgnl()) {
      transition.ognl = "";
    }
    props.onFormSubmit?.(transition);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={() => props.onDialogClose?.()}>
      <h5 class="mb-2">{props.dict.editTransition}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[71px_280px] items-center space-y-2">
          <div>ID:</div>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>{props.dict.connectCondition}</div>
          <div class="flex items-center">
            <input
              type="radio"
              id="condition-on"
              name="condition"
              class="cursor-pointer"
              checked={showOgnl()}
              onChange={() => setShowOgnl(true)}
            />
            <label for="condition-on" class="mr-2 cursor-pointer pl-1">
              {props.dict.conditionOn}
            </label>
            <input
              type="radio"
              id="condition-off"
              name="condition"
              class="cursor-pointer"
              checked={!showOgnl()}
              onChange={() => setShowOgnl(false)}
            />
            <label for="condition-off" class="cursor-pointer pl-1">
              {props.dict.conditionOff}
            </label>
          </div>
          <div classList={{ invisible: !showOgnl() }}>{props.dict.conditionExpression} (OGNL)</div>
          <input
            classList={{ invisible: !showOgnl() }}
            type="text"
            value={formData.ognl}
            onChange={(e) => setFormData("ognl", e.target.value)}
          />
        </div>

        <ButtonsContainer>
          <button type="submit">OK</button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
