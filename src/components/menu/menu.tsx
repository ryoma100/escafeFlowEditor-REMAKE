import { useModel } from "../../context/model-context";
import { useOperation } from "../../context/operation-context";
import "./menu.css";

export function Menu() {
  const {
    pkg: { setPackageDialog },
    process: { setOpenProcessDialog },
    actor: { setOpenActorDialog },
  } = useOperation();
  const {
    processModel: { addProcess, removeSelectedProcess },
    actorModel: { addActor, removeSelectedActor },
  } = useModel();

  function handleFileNewClick() {
    return false;
  }

  function handleFileOpenClick() {
    return false;
  }

  function handleFileSaveClick() {
    return false;
  }

  function handleEditSelectAllClick() {
    return false;
  }

  function handleEditRemoveClick() {
    return false;
  }

  function handleEditPropertyClick() {
    return false;
  }

  function handlePackagePropertyClick() {
    setPackageDialog(true);
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
    setOpenProcessDialog(true);
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
    setOpenActorDialog(true);
    return false;
  }

  function handleHelpAboutClick() {
    return false;
  }

  return (
    <nav class="menu__bar">
      <ul>
        <li class="menu__item">
          <a href="#">ファイル</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleFileNewClick}>
                新規作成
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleFileOpenClick}>
                開く
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleFileSaveClick}>
                保存
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">編集</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleEditSelectAllClick}>
                すべて選択
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleEditRemoveClick}>
                削除
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleEditPropertyClick}>
                プロパティ
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">パッケージ</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handlePackagePropertyClick}>
                プロパティ
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">プロセス</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleProcessAddClick}>
                追加
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleProcessRemoveClick}>
                削除
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleProcessPropertyClick}>
                プロパティ
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">アクター</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleActorAddClick}>
                追加
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleActorRemoveClick}>
                削除
              </a>
            </li>
            <li class="menu__drop-item">
              <a href="#" onClick={handleActorPropertyClick}>
                プロパティ
              </a>
            </li>
          </ul>
        </li>
        <li class="menu__item">
          <a href="#">ヘルプ</a>
          <ul class="menu__drop">
            <li class="menu__drop-item">
              <a href="#" onClick={handleHelpAboutClick}>
                このエディタについて
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
