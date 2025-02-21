import * as i18n from "@solid-primitives/i18n";
import type { JSXElement } from "solid-js";

import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { Menu, MenuBar, MenuItem } from "../parts/menu";

export function AppMenu(): JSXElement {
  const { dict } = useThemeContext();
  const { projectModel, processModel, actorModel, nodeModel, activityNodeModel, edgeModel, dialogModel } =
    useModelContext();
  const t = i18n.translator(dict);

  function handleFileNewClick() {
    dialogModel.setOpenDialog({ type: "initAll" });
    return false;
  }

  function handleFileOpenClick() {
    dialogModel.setOpenDialog({ type: "load" });
    return false;
  }

  function handleFileSettingClick() {
    dialogModel.setOpenDialog({ type: "setting" });
    return false;
  }

  function handleFileSaveClick() {
    projectModel.save();
    dialogModel.setOpenDialog({
      type: "save",
      project: projectModel.project(),
    });
    return false;
  }

  function handleEditSelectAllClick() {
    nodeModel.changeSelectNodes("selectAll");
    return false;
  }

  function handleEditRemoveClick() {
    edgeModel.deleteSelectedEdge();
    nodeModel.deleteSelectedNodes();
    activityNodeModel.updateAllJoinSplitType(edgeModel.edgeList);
    return false;
  }

  function handleEditPropertyClick() {
    if (nodeModel.getSelectedNodes().length + edgeModel.selectedEdges().length === 1) {
      nodeModel.getSelectedNodes().forEach((it) => {
        if (it.type === "activityNode") {
          dialogModel.setOpenDialog({ type: "activity", activity: it });
        } else if (it.type === "commentNode") {
          dialogModel.setOpenDialog({ type: "comment", comment: it });
        }
      });
      edgeModel.selectedEdges().forEach((it) => {
        if (it.type === "transitionEdge") {
          dialogModel.setOpenDialog({ type: "transition", transition: it });
        }
      });
    }
    return false;
  }

  function handleProjectPropertyClick() {
    dialogModel.setOpenDialog({
      type: "project",
      project: projectModel.project(),
    });
    return false;
  }

  function handleProcessAddClick() {
    processModel.addProcess(processModel.processList());
    return false;
  }

  function handleProcessRemoveClick() {
    dialogModel.setOpenDialog({
      type: "deleteProcess",
      process: processModel.selectedProcess(),
    });
    return false;
  }

  function handleProcessPropertyClick() {
    dialogModel.setOpenDialog({
      type: "process",
      process: processModel.selectedProcess(),
    });
    return false;
  }

  function handleActorAddClick() {
    actorModel.addActor();
    return false;
  }

  function handleActorRemoveClick() {
    const err = actorModel.removeSelectedActor(nodeModel.nodeList);
    if (err != null) {
      dialogModel.setOpenMessage(err);
    }
    return false;
  }

  function handleActorPropertyClick() {
    dialogModel.setOpenDialog({
      type: "actor",
      actor: actorModel.selectedActor(),
    });
    return false;
  }

  function handleHelpAboutClick() {
    dialogModel.setOpenDialog({ type: "about" });
    return false;
  }

  return (
    <header class="flex size-full flex-row justify-between bg-primary">
      <MenuBar>
        <Menu title={t("file")}>
          <MenuItem title={t("new")} onClick={handleFileNewClick} />
          <MenuItem title={t("open")} onClick={handleFileOpenClick} />
          <MenuItem title={t("save")} onClick={handleFileSaveClick} />
          <MenuItem title={t("setting")} onClick={handleFileSettingClick} />
        </Menu>
        <Menu title={t("edit")}>
          <MenuItem title={t("selectAll")} onClick={handleEditSelectAllClick} />
          <MenuItem title={t("delete")} onClick={handleEditRemoveClick} />
          <MenuItem title={t("property")} onClick={handleEditPropertyClick} />
        </Menu>
        <Menu title={t("package")}>
          <MenuItem title={t("property")} onClick={handleProjectPropertyClick} />
        </Menu>
        <Menu title={t("process")}>
          <MenuItem title={t("add")} onClick={handleProcessAddClick} />
          <MenuItem title={t("delete")} onClick={handleProcessRemoveClick} />
          <MenuItem title={t("property")} onClick={handleProcessPropertyClick} />
        </Menu>
        <Menu title={t("actor")}>
          <MenuItem title={t("add")} onClick={handleActorAddClick} />
          <MenuItem title={t("delete")} onClick={handleActorRemoveClick} />
          <MenuItem title={t("property")} onClick={handleActorPropertyClick} />
        </Menu>
        <Menu title={t("help")}>
          <MenuItem title={t("about")} onClick={handleHelpAboutClick} />
        </Menu>
      </MenuBar>
    </header>
  );
}
