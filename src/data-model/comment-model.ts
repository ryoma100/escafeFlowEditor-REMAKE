import { createStore, produce, unwrap } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { dataSource } from "../data-source/data-source";
import { CommentNodeEntity, ProcessEntity } from "../data-source/data-type";

export function createCommentModel() {
  let selectedProcess: ProcessEntity = dataSource.project.processes[0];
  const [commentList, setCommentList] = createStore<CommentNodeEntity[]>([]);

  function saveComment() {
    dataSource.findProcess(selectedProcess.id).comments = [...unwrap(commentList)];
  }

  function loadComment(process: ProcessEntity) {
    selectedProcess = process;
    setCommentList(dataSource.findProcess(process.id).comments);
  }

  function addComment(x: number, y: number): CommentNodeEntity {
    const comment = dataFactory.createComment(selectedProcess);
    comment.x = x - 16;
    comment.y = y - 16;
    setCommentList([...commentList, comment]);
    return comment;
  }

  function moveSelectedComments(moveX: number, moveY: number) {
    setCommentList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      }),
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
      }),
    );
  }

  function toggleSelectComment(id: number) {
    setCommentList(
      (it) => it.id === id,
      produce((it) => {
        it.selected = !it.selected;
      }),
    );
  }

  return {
    commentList,
    setCommentList,
    addComment,
    moveSelectedComments,
    selectComments,
    toggleSelectComment,
    saveComment,
    loadComment,
  };
}
