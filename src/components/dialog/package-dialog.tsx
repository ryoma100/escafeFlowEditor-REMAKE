import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import "./dialog.css";
import { useAppContext } from "../../context/app-context";
import { PackageEntity } from "../../data-source/data-type";

export function PackageDialog(): JSXElement {
  const {
    packageModel: { setPkg },
    dialog: { openPackageDialog, setOpenPackageDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<PackageEntity>(null as any);

  createEffect(() => {
    const pkg = openPackageDialog();
    if (pkg != null) {
      setFormData({ ...pkg });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    setPkg({ ...formData });
    setOpenPackageDialog(null);
  }

  function handleClose() {
    setOpenPackageDialog(null);
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
            value={formData.xpdlId}
            onInput={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div />
          <div>名前：</div>
          <input
            type="text"
            value={formData.name}
            onInput={(e) => setFormData("name", e.target.value)}
          />
          <div />
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
