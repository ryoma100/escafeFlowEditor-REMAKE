import { createSignal } from "solid-js";

import type { i18nEnDict } from "@/constants/i18n";
import type {
  ActivityNode,
  ActorEntity,
  CommentNode,
  ProcessEntity,
  ProjectEntity,
  TransitionEdge,
} from "@/data-source/data-type";

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
  const [openDialog, setOpenDialog] = createSignal<ModalDialogType | null>(null);
  const [openMessage, setOpenMessage] = createSignal<keyof typeof i18nEnDict | null>(null);

  return {
    openDialog,
    setOpenDialog,
    openMessage,
    setOpenMessage,
  };
}
