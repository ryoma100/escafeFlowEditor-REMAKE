import { For } from "solid-js";
import { useOperation } from "../../context/operation-context";
import "./list.css";
import { ProcessEntity } from "../../data-source/data-type";
import { useModel } from "../../context/model-context";

export function ProcessList() {
  const {
    process: { setOpenProcessDialog },
  } = useOperation();
  const {
    processModel: {
      processList,
      selectedProcess,
      addProcess,
      removeSelectedProcess,
      changeProcess,
    },
  } = useModel();

  function handleItemMouseDown(process: ProcessEntity, _: MouseEvent) {
    changeProcess(process);
  }

  function handleItemDblClick(_: MouseEvent) {
    setOpenProcessDialog(true);
  }

  function handleAddButtonClick(_: MouseEvent) {
    addProcess();
  }

  function handleRemoveButtonClick(_: MouseEvent) {
    removeSelectedProcess();
  }

  return (
    <div class="list">
      <h5>プロセス</h5>
      <div class="list__scroll--outer">
        <ul class="list__scroll--inner">
          <For each={processList()}>
            {(it) => (
              <li
                class="list__item"
                classList={{
                  "list__item--selected": it.id === selectedProcess().id,
                }}
                onMouseDown={[handleItemMouseDown, it]}
                onDblClick={handleItemDblClick}
              >
                {it.name}
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="list__buttons">
        <button onClick={handleAddButtonClick}>追加</button>
        <button
          onClick={handleRemoveButtonClick}
          disabled={processList().length === 1}
        >
          削除
        </button>
      </div>
    </div>
  );
}
