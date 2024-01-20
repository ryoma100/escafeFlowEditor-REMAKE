import { For, Match, Switch } from "solid-js";
import { useDialog, useModel } from "../../context";
import "./list.css";
import { ProcessEntity } from "../../models/process-model";

export function ProcessList() {
  const {
    process: { setOpenProcessDialog },
  } = useDialog();
  const {
    process: {
      processList,
      selectedProcess,
      setSelectedProcess,
      addProcess,
      removeProcess,
    },
  } = useModel();

  // onClickとonDblClick両方セットすると、onDblClickが呼ばれない
  let lastClickTime: number = new Date().getTime();
  function handleItemClick(item: ProcessEntity, _: MouseEvent) {
    const time = new Date().getTime();
    if (lastClickTime + 200 < time) {
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
    removeProcess();
  }

  return (
    <div class="list">
      <h5>プロセス</h5>
      <div class="list__scroll--outer">
        <ul class="list__scroll--inner">
          <For each={processList()}>
            {(item) => (
              <Switch>
                <Match when={item.id === selectedProcess().id}>
                  <li
                    class="list__item list__item--selected"
                    onClick={[handleItemClick, item]}
                  >
                    {item.title}
                  </li>
                </Match>
                <Match when={item.id !== selectedProcess().id}>
                  <li class="list__item" onClick={[handleItemClick, item]}>
                    {item.title}
                  </li>
                </Match>
              </Switch>
            )}
          </For>
        </ul>
      </div>
      <div>
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
