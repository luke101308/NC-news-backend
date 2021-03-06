const {
  getAllTopics,
} = require("../controllers/topics");

const {
  getArticlesByTopic,
  postNewArticle
} = require("../controllers/articles")

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getAllTopics);

topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesByTopic)
  .post(postNewArticle);

module.exports = topicsRouter;
