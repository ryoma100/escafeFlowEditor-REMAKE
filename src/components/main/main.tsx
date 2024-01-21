import "./main.css";
import { useModel, useOperation } from "../../context";
import { Diagram } from "../../diagram/disgram";

export function Main() {
  const {
    toolbar: { toolbar },
  } = useOperation();
  const {
    process: { selectedProcess },
  } = useModel();

  return (
    <div class="main">
      <h5>{selectedProcess().title}</h5>
      <div class="main__diagram">
        <Diagram />
      </div>
      <div class="main__zoom">
        <button>Auto</button>
        <span>{toolbar()}</span>
        <button>100%</button>
      </div>
    </div>
  );
}
