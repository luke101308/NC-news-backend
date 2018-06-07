const { getAllArticles } = require("../controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id/comments")
  .get()
  .post();

articlesRouter.route("/:article_id").put();

module.exports = articlesRouter;
