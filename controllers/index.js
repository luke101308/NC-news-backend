const { User, Article, Comment, Topic } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find().then(topics => {
    res.send({ topics });
  });
};

const getAllArticles = (req, res, next) => {
  Article.find()
    .then(articlesDocs => {
      articles = [];
      articlesDocs.forEach((article, i) => {
        articles.push({
          votes: article.votes,
          _id: article._id,
          title: article.title,
          created_by: article.created_by,
          body: article.body,
          belongs_to: article.belongs_to,
          __v: article.__v,
          comments: Comment.find({ belongs_to: article._id }).then(comments => {
            console.log(comments);
            return comments.length;
          })
        });
      });
      return articles;
    })
    .then(articles => {
      res.send({ articles });
    });
};

module.exports = { getAllTopics, getAllArticles };
