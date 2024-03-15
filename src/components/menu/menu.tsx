import * as i18n from "@solid-primitives/i18n";
import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";

export function AppMenu(): JSXElement {
  const {
    projectModel: { save },
    processModel: { addProcess, selectedProcess, processList },
    actorModel: { addActor, removeSelectedActor, selectedActor },
    nodeModel: { deleteSelectedNodes, changeSelectNodes, getSelectedNodes, nodeList },
    activityNodeModel: { updateAllJoinSplitType },
    edgeModel: { deleteSelectedEdge, selectedEdges, edgeList },
    dialog: {
      setOpenProjectDialog,
      setOpenProcessDialog,
      setOpenActorDialog,
      setOpenSaveDialog,
      setOpenCommentDialog,
      setOpenTransitionDialog,
      setOpenMessageDialog,
      setOpenAboutDialog,
      setOpenConfirmDialog,
    },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  function handleFileNewClick() {
    setOpenConfirmDialog("initAll");
    return false;
  }

  function handleFileOpenClick() {
    return false;
  }

  function handleFileSaveClick() {
    setOpenSaveDialog(save());
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
            setOpenActorDialog(it);
            break;
          case "commentNode":
            setOpenCommentDialog(it);
            break;
        }
      });
      selectedEdges().forEach((it) => {
        switch (it.type) {
          case "transitionEdge":
            setOpenTransitionDialog(it);
            break;
        }
      });
    }
    return false;
  }

  function handleProjectPropertyClick() {
    setOpenProjectDialog(true);
    return false;
  }

  function handleProcessAddClick() {
    addProcess(processList());
    return false;
  }

  function handleProcessRemoveClick() {
    setOpenConfirmDialog("deleteProcess");
    return false;
  }

  function handleProcessPropertyClick() {
    setOpenProcessDialog(selectedProcess());
    return false;
  }

  function handleActorAddClick() {
    addActor(selectedProcess());
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
    setOpenActorDialog(selectedActor());
    return false;
  }

  function handleHelpAboutClick() {
    setOpenAboutDialog(true);
    return false;
  }

  return (
    <MenuBar>
      <Menu title={t("file")}>
        <MenuItem title={t("new")} onClick={handleFileNewClick} />
        <MenuItem title={t("open")} onClick={handleFileOpenClick} />
        <MenuItem title={t("save")} onClick={handleFileSaveClick} />
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

function MenuBar(props: { children: JSXElement }): JSXElement {
  return (
    <nav class="h-full bg-primary2">
      <ul class="flex">{props.children}</ul>
    </nav>
  );
}

function Menu(props: { title: string; children: JSXElement }): JSXElement {
  return (
    <li
      class="
        group relative z-10
        hover:bg-primary1"
    >
      <a class="px-2 no-underline" href="#">
        {props.title}
      </a>
      <ul
        class="
          invisible absolute w-max
          list-none bg-primary2 p-0 group-hover:visible"
      >
        {props.children}
      </ul>
    </li>
  );
}

function MenuItem(props: { title: string; onClick: () => void }): JSXElement {
  return (
    <li class="px-4 py-1 hover:bg-primary1">
      <a class="flex items-center p-0" href="#" onClick={() => props.onClick()}>
        {props.title}
      </a>
    </li>
  );
}
