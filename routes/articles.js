const {
  getAllArticles,
  getArticleByArticleId,
  changeArticleVoteCount
} = require("../controllers/articles");

const {
  getCommentsForArticle,
  postNewComment,
} = require("../controllers/comments")

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
