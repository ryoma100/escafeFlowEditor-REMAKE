import { For, createSignal } from "solid-js";
import { useOperation } from "../../context/operation-context";
import "./list.css";
import { dataSource } from "../../data-source/data-source";
import { ProcessEntity } from "../../data-source/data-type";
import { dataFactory } from "../../data-source/data-factory";

export function ProcessList() {
  const {
    process: { setOpenProcessDialog },
  } = useOperation();

  const [processList, setProcessList] = createSignal<ProcessEntity[]>(
    dataSource.pkg.processes
  );

  // onClickとonDblClick両方セットすると、onDblClickが呼ばれない
  let lastClickTime: number = new Date().getTime();
  function handleItemClick(item: ProcessEntity, _: MouseEvent) {
    const time = new Date().getTime();
    if (lastClickTime + 250 < time) {
      const list = processList().map((it) =>
        it.id === item.id && !it.selected
          ? { ...it, selected: true }
          : it.selected
            ? { ...it, selected: false }
            : it
      );
      setProcessList(list);
    } else {
      setOpenProcessDialog(true);
    }
    lastClickTime = time;
  }

  function handleAddClick(_: MouseEvent) {
    const unselectProcessList = processList().map((it) =>
      it.selected ? { ...it, selected: false } : it
    );
    const selectProcess = dataFactory.createProcess(dataSource.pkg, true);
    setProcessList([...unselectProcessList, selectProcess]);
  }

  function handleRemoveClick(_: MouseEvent) {
    const list = processList().filter((it) => !it.selected);
    list[0] = { ...list[0], selected: true };
    setProcessList(list);
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
                classList={{ "list__item--selected": it.selected }}
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
