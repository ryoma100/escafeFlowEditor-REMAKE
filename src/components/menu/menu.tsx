import * as i18n from "@solid-primitives/i18n";
import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import "./menu.css";

export function Menu(): JSXElement {
  const {
    projectModel: { project, initProject },
    processModel: { addProcess, removeSelectedProcess, selectedProcess },
    actorModel: { addActor, removeSelectedActor, selectedActor },
    baseNodeModel: { changeSelectNodes, removeSelectedNodes },
    baseEdgeModel: { removeSelectedEdge },
    dialog: { setOpenProjectDialog, setOpenProcessDialog, setOpenActorDialog, setOpenSaveDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  function handleFileNewClick() {
    initProject();
    return false;
  }

  function handleFileOpenClick() {
    return false;
  }

  function handleFileSaveClick() {
    setOpenSaveDialog(project);
    return false;
  }

  function handleEditSelectAllClick() {
    changeSelectNodes("selectAll");
    return false;
  }

  function handleEditRemoveClick() {
    removeSelectedEdge();
    removeSelectedNodes();
    return false;
  }

  function handleEditPropertyClick() {
    return false;
  }

  function handleProjectPropertyClick() {
    setOpenProjectDialog(project);
    return false;
  }

  function handleProcessAddClick() {
    addProcess();
    return false;
  }

  function handleProcessRemoveClick() {
    removeSelectedProcess();
    return false;
  }

  function handleProcessPropertyClick() {
    setOpenProcessDialog(selectedProcess());
    return false;
  }

  function handleActorAddClick() {
    addActor();
    return false;
  }

  function handleActorRemoveClick() {
    removeSelectedActor();
    return false;
  }

  function handleActorPropertyClick() {
    setOpenActorDialog(selectedActor());
    return false;
  }

  function handleHelpAboutClick() {
    return false;
  }

  return (
    <nav class="menu__bar">
      <ul>
        <li class="menu__item">
          <a href="#">{t("file")}</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleFileNewClick}>
                {t("new")}
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleFileOpenClick}>
                {t("open")}
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleFileSaveClick}>
                {t("save")}
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">{t("edit")}</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleEditSelectAllClick}>
                {t("selectAll")}
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleEditRemoveClick}>
                {t("delete")}
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleEditPropertyClick}>
                {t("property")}
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">{t("package")}</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleProjectPropertyClick}>
                {t("property")}
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">{t("process")}</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleProcessAddClick}>
                {t("add")}
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleProcessRemoveClick}>
                {t("delete")}
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleProcessPropertyClick}>
                {t("property")}
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">{t("actor")}</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleActorAddClick}>
                {t("add")}
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleActorRemoveClick}>
                {t("delete")}
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleActorPropertyClick}>
                {t("property")}
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">{t("help")}</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleHelpAboutClick}>
                {t("about")}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
