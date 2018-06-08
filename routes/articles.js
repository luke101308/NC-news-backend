const {
  getAllArticles,
  getArticleByArticleId,
  getCommentsForArticle,
  postNewComment,
  changeArticleVoteCount
} = require("../controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(postNewComment);

articlesRouter
  .route("/:id")
  .get(getArticleByArticleId)
  .put(changeArticleVoteCount);

module.exports = articlesRouter;
