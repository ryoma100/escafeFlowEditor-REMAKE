import * as i18n from "@solid-primitives/i18n";
import { JSXElement } from "solid-js";

import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";

export function AppMenu(): JSXElement {
  const { dict } = useThemeContext();
  const {
    projectModel: { project, save },
    processModel: { addProcess, selectedProcess, processList },
    actorModel: { addActor, removeSelectedActor, selectedActor },
    nodeModel: { deleteSelectedNodes, changeSelectNodes, getSelectedNodes, nodeList },
    activityNodeModel: { updateAllJoinSplitType },
    edgeModel: { deleteSelectedEdge, selectedEdges, edgeList },
    dialogModel: { setModalDialog: setOpenDialog, setMessageAlert: setOpenMessageDialog },
  } = useModelContext();
  const t = i18n.translator(dict);

  function handleFileNewClick() {
    setOpenDialog({ type: "initAll" });
    return false;
  }

  function handleFileOpenClick() {
    setOpenDialog({ type: "load" });
    return false;
  }

  function handleFileSettingClick() {
    setOpenDialog({ type: "setting" });
    return false;
  }

  function handleFileSaveClick() {
    save();
    setOpenDialog({ type: "save", project: project() });
    return false;
  }

  function handleEditSelectAllClick() {
    changeSelectNodes("selectAll");
    return false;
  }

  function handleEditRemoveClick() {
    deleteSelectedEdge();
    deleteSelectedNodes();
    updateAllJoinSplitType(edgeList);
    return false;
  }

  function handleEditPropertyClick() {
    if (getSelectedNodes().length + selectedEdges().length === 1) {
      getSelectedNodes().forEach((it) => {
        switch (it.type) {
          case "activityNode":
            setOpenDialog({ type: "activity", activity: it });
            break;
          case "commentNode":
            setOpenDialog({ type: "comment", comment: it });
            break;
        }
      });
      selectedEdges().forEach((it) => {
        switch (it.type) {
          case "transitionEdge":
            setOpenDialog({ type: "transition", transition: it });
            break;
        }
      });
    }
    return false;
  }

  function handleProjectPropertyClick() {
    setOpenDialog({ type: "project", project: project() });
    return false;
  }

  function handleProcessAddClick() {
    addProcess(processList());
    return false;
  }

  function handleProcessRemoveClick() {
    setOpenDialog({ type: "deleteProcess", process: selectedProcess() });
    return false;
  }

  function handleProcessPropertyClick() {
    setOpenDialog({ type: "process", process: selectedProcess() });
    return false;
  }

  function handleActorAddClick() {
    addActor();
    return false;
  }

  function handleActorRemoveClick() {
    const err = removeSelectedActor(nodeList);
    if (err != null) {
      setOpenMessageDialog(err);
    }
    return false;
  }

  function handleActorPropertyClick() {
    setOpenDialog({ type: "actor", actor: selectedActor() });
    return false;
  }

  function handleHelpAboutClick() {
    setOpenDialog({ type: "about" });
    return false;
  }

  return (
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
  );
}

function MenuBar(props: { readonly children: JSXElement }): JSXElement {
  return (
    <nav class="h-full bg-primary2">
      <ul class="flex">{props.children}</ul>
    </nav>
  );
}

function Menu(props: { readonly title: string; readonly children: JSXElement }): JSXElement {
  return (
    <li class="group relative z-10 hover:bg-primary1">
      <a class="px-2 no-underline" href="#">
        {props.title}
      </a>
      <ul class="invisible absolute w-max list-none bg-primary2 p-0 group-hover:visible">
        {props.children}
      </ul>
    </li>
  );
}

function MenuItem(props: { readonly title: string; readonly onClick: () => void }): JSXElement {
  return (
    <li class="px-4 py-1 hover:bg-primary1">
      <a class="flex items-center p-0" href="#" onClick={() => props.onClick()}>
        {props.title}
      </a>
    </li>
  );
}
