const commentsRouter = require("express").Router();
const { changeCommentVoteCount, deleteComment } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .put(changeCommentVoteCount)
  .delete(deleteComment);

module.exports = commentsRouter;
