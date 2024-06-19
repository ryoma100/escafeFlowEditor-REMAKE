import { i18nEnDict } from "@/constants/i18n";
import {
  ActivityNode,
  ActorEntity,
  CommentNode,
  ProcessEntity,
  ProjectEntity,
  TransitionEdge,
} from "@/data-source/data-type";
import { createSignal } from "solid-js";

export type ModalDialogType =
  | { type: "initAll" }
  | { type: "load" }
  | { type: "save"; project: ProjectEntity }
  | { type: "setting" }
  | { type: "project"; project: ProjectEntity }
  | { type: "process"; process: ProcessEntity }
  | { type: "deleteProcess"; process: ProcessEntity }
  | { type: "actor"; actor: ActorEntity }
  | { type: "activity"; activity: ActivityNode }
  | { type: "transition"; transition: TransitionEdge }
  | { type: "comment"; comment: CommentNode }
  | { type: "about" };

export function makeDialogModel() {
  const [modalDialog, setModalDialog] = createSignal<ModalDialogType | null>(null);
  const [messageAlert, setMessageAlert] = createSignal<keyof typeof i18nEnDict | null>(null);

  return {
    modalDialog,
    setModalDialog,
    messageAlert,
    setMessageAlert,
  };
}
