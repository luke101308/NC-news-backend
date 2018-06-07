const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .put()
  .delete();

module.exports = commentsRouter;
