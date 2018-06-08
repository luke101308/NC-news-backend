const commentsRouter = require("express").Router();
const { changeCommentVoteCount, deleteComment } = require("../controllers");

commentsRouter
  .route("/:id")
  .put(changeCommentVoteCount)
  .delete(deleteComment);

module.exports = commentsRouter;
