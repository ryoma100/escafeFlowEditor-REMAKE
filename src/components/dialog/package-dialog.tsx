import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import "./dialog.css";
import { PackageEntity } from "../../models/package-model";
import { useAppContext } from "../../context/app-context";

export function PackageDialog() {
  const {
    packageModel: { pkg, setPkg, defaultPackage },
    dialog: { openPackageDialog, setOpenPackageDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<PackageEntity>(defaultPackage());

  createEffect(() => {
    if (openPackageDialog()) {
      setFormData({ ...pkg() });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    setPkg({ ...formData });
    setOpenPackageDialog(false);
  }

  function handleClose() {
    setOpenPackageDialog(false);
  }

  let dialog: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialog} onClose={handleClose}>
      <h5>パッケージの編集</h5>
      <form method="dialog">
        <div class="dialog__input">
          <div>ID：</div>
          <input
            type="text"
            value={formData.pkgId}
            onInput={(e) => setFormData("pkgId", e.target.value)}
          />
          <div>名前：</div>
          <input
            type="text"
            value={formData.title}
            onInput={(e) => setFormData("title", e.target.value)}
          />
        </div>
        <div class="dialog__buttons">
          <button type="button" onClick={handleOkButtonClick}>
            OK
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
