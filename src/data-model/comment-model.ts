import { createStore, produce, unwrap } from "solid-js/store";
import { dataSource } from "../data-source/data-source";
import { CommentEntity, ProcessEntity } from "../data-source/data-type";
import { dataFactory } from "../data-source/data-factory";

export function createCommentModel() {
  let selectedProcess: ProcessEntity = dataSource.pkg.processes[0];
  const [commentList, setCommentList] = createStore<CommentEntity[]>([]);

  function saveComment() {
    dataSource.findProcess(selectedProcess.id).comments = [
      ...unwrap(commentList),
    ];
  }

  function loadComment(process: ProcessEntity) {
    selectedProcess = process;
    setCommentList(dataSource.findProcess(process.id).comments);
  }

  function addComment(x: number, y: number) {
    const comment = dataFactory.createComment(selectedProcess);
    comment.x = x - 16;
    comment.y = y - 16;
    setCommentList([...commentList, comment]);
    return comment.id;
  }

  function moveSelectedComments(moveX: number, moveY: number) {
    setCommentList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      })
    );
  }

  function selectComments(ids: number[]) {
    setCommentList(
      () => true,
      produce((it) => {
        const selected = ids.includes(it.id);
        if (it.selected !== selected) {
          it.selected = selected;
        }
      })
    );
  }

  function toggleSelectComment(id: number) {
    setCommentList(
      (it) => it.id === id,
      produce((it) => {
        it.selected = !it.selected;
      })
    );
  }

  return {
    commentList,
    addComment,
    moveSelectedComments,
    selectComments,
    toggleSelectComment,
    saveComment,
    loadComment,
  };
}
