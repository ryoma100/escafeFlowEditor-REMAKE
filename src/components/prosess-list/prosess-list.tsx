import { For, Match, Switch, createSignal } from "solid-js";
import "./prosess-list.css";
import { ProcessDialog } from "../dialog/process-dialog";

const defaultProcessList = [...Array(20)].map((_, index) => {
  return { id: index + 1, title: `プロセス${index + 1}` };
});

export type ProcessType = {
  id: number;
  title: string;
};

export function ProsessList() {
  const [processList, setProcessList] =
    createSignal<ProcessType[]>(defaultProcessList);
  const [selectedProcess, setSelectedProcess] = createSignal<ProcessType>(
    defaultProcessList[0]
  );
  const [dialogOpen, setDialogOpen] = createSignal<boolean>(false);

  // onClickとonDblClick両方セットすると、onDblClickが呼ばれない
  let clickCouunt = 0;
  function handleItemClick(item: ProcessType, _: MouseEvent) {
    clickCouunt++;
    if (clickCouunt < 2) {
      setTimeout(() => {
        setSelectedProcess(item);
        if (clickCouunt > 1) {
          // double click
          setDialogOpen(true);
        }
        clickCouunt = 0;
      }, 200);
    }
  }

  function handleAddClick(_: MouseEvent) {
    const item = { id: 99, title: "テスト" };
    setProcessList([...processList(), item]);
    setSelectedProcess(item);
  }

  function handleRemoveClick(_: MouseEvent) {
    const nextSelectedIndex = Math.min(
      processList().findIndex((it) => it.id === selectedProcess().id),
      processList().length - 2
    );
    const newList = processList().filter(
      (it) => it.id !== selectedProcess().id
    );
    setProcessList(newList);
    setSelectedProcess(newList[nextSelectedIndex]);
  }

  return (
    <>
      <div class="prosess-list-area">
        <h5>プロセス</h5>
        <div class="list-scroll">
          <ul class="list">
            <For each={processList()}>
              {(item) => (
                <Switch>
                  <Match when={item.id === selectedProcess().id}>
                    <li class="list-item list-item-selected">{item.title}</li>
                  </Match>
                  <Match when={item.id !== selectedProcess().id}>
                    <li class="list-item" onClick={[handleItemClick, item]}>
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

      <ProcessDialog
        open={dialogOpen()}
        item={selectedProcess()}
        onOkButtonClick={() => setDialogOpen(false)}
        onCancelButtonClick={() => setDialogOpen(false)}
      />
    </>
  );
}
