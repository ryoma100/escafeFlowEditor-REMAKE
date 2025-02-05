import * as i18n from "@solid-primitives/i18n";
import { type JSXElement, Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { dataFactory, deepUnwrap, toNodeId } from "@/data-source/data-factory";
import type { TransitionEdge } from "@/data-source/data-type";
import { Button } from "../parts/button";

export function TransitionDialog(): JSXElement {
  const { dialogModel, transitionEdgeModel } = useModelContext();

  function handleFormSubmit(formData: TransitionEdge) {
    const errorMessage = transitionEdgeModel.updateTransitionEdge(formData);
    if (errorMessage) {
      dialogModel.setOpenMessage(errorMessage);
      return;
    }
    dialogModel.setOpenDialog(null);
  }

  function handleDialogClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (dialogModel.openDialog()?.type === "transition") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const transition = () => {
    const dialogData = dialogModel.openDialog();
    return dialogData?.type === "transition" ? dialogData.transition : undefined;
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={transition()} keyed={true}>
        {(transition) => (
          <TransitionDialogView
            transition={transition}
            onFormSubmit={handleFormSubmit}
            onDialogClose={handleDialogClose}
          />
        )}
      </Show>
    </dialog>
  );
}

export function TransitionDialogView(props: {
  readonly transition: TransitionEdge;
  readonly onFormSubmit?: (formData: TransitionEdge) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const dummy = dataFactory.createTransitionEdge([], toNodeId(0), toNodeId(0));
  const [formData, setFormData] = createStore<TransitionEdge>(dummy);
  const [showOgnl, setShowOgnl] = createSignal<boolean>(false);

  onMount(() => {
    setFormData(deepUnwrap(props.transition));
    setShowOgnl(props.transition.ognl !== "");
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    const transition = deepUnwrap(formData);
    if (!showOgnl()) {
      transition.ognl = "";
    }
    props.onFormSubmit?.(transition);
  }

  return (
    <div class="w-96 bg-primary p-2">
      <h5 class="mb-2">{t("editTransition")}</h5>
      <form class="bg-background p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[71px_280px] items-center space-y-2">
          <div>ID:</div>
          <input type="text" value={formData.xpdlId} onChange={(e) => setFormData("xpdlId", e.target.value)} />
          <div>{t("connectCondition")}</div>
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
              {t("conditionOn")}
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
              {t("conditionOff")}
            </label>
          </div>
          <div classList={{ invisible: !showOgnl() }}>{t("conditionExpression")} (OGNL)</div>
          <input
            classList={{ invisible: !showOgnl() }}
            type="text"
            value={formData.ognl}
            onChange={(e) => setFormData("ognl", e.target.value)}
          />
        </div>

        <ButtonsContainer>
          <Button type="submit">OK</Button>
          <Button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </Button>
        </ButtonsContainer>
      </form>
    </div>
  );
}
