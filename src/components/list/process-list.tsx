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
    process: {
      processList,
      selectedProcess,
      setSelectedProcess,
      addProcess,
      removeSelectedProcess,
    },
  } = useModel();

  // onClickとonDblClick両方セットすると、onDblClickが呼ばれない
  let lastClickTime: number = new Date().getTime();
  function handleItemClick(item: ProcessEntity, _: MouseEvent) {
    const time = new Date().getTime();
    if (lastClickTime + 250 < time) {
      setSelectedProcess(item);
    } else {
      setOpenProcessDialog(true);
    }
    lastClickTime = time;
  }

  function handleAddClick(_: MouseEvent) {
    addProcess();
  }

  function handleRemoveClick(_: MouseEvent) {
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
                onClick={[handleItemClick, it]}
              >
                {it.name}
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="list__buttons">
        <button onClick={handleAddClick}>追加</button>
        <button
          onClick={handleRemoveClick}
          disabled={processList().length === 1}
        >
          削除
        </button>
      </div>
    </div>
  );
}
