import { createStore, produce } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { CommentNodeEntity, ProcessEntity } from "../data-source/data-type";

export function makeCommentModel() {
  let process: ProcessEntity;
  const [commentList, setCommentList] = createStore<CommentNodeEntity[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setCommentList(process.comments);
  }

  function save() {
    process.comments = [...commentList];
  }

  function addComment(x: number, y: number): CommentNodeEntity {
    const comment = dataFactory.createComment(process);
    comment.x = x - 16;
    comment.y = y - 16;
    setCommentList([...commentList, comment]);
    return comment;
  }

  function resizeCommentSize(comment: CommentNodeEntity, width: number, height: number) {
    setCommentList(
      (it) => it.id === comment.id,
      produce((it) => {
        it.width = width;
        it.height = height;
      }),
    );
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
    load,
    save,
    commentList,
    setCommentList,
    addComment,
    resizeCommentSize,
    moveSelectedComments,
    selectComments,
    toggleSelectComment,
  };
}
