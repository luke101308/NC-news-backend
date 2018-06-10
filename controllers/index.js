const { User, Article, Comment, Topic } = require("../models");
const { createCommentCount } = require("../utils");

const getAllTopics = (req, res, next) => {
  Topic.find().then(topics => {
    res.send({ topics });
  });
};

const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  Article.find({ belongs_to: topic_slug }).then(articlesDocs => {
    if (articlesDocs[0] === undefined){
       next({
          status: 404,
          message: `error:404 ${topic_slug} not present in database`
        })}
    else{
      return Promise.all([
        articlesDocs,
        ...articlesDocs.map(article => {
          return Comment.count({ belongs_to: article._id }).then(comment => {
            return comment;
          });
        })
      ]);
    }
  }).then(([articlesDocs, ...count]) => {
    articles = [];
    articlesDocs.forEach((article, i) => {
      articles.push({
        _id: article._id,
        title: article.title,
        body: article.body,
        belongs_to: article.belongs_to,
        votes: article.votes,
        created_by: article.created_by,
        comments: count[i],
        _v: article._v
      });
    });
    return articles;
  })
    .then(articles => {
      res.send({ articles });
    });
};

const postNewArticle = (req, res, next) => {
  const { topic_slug } = req.params;
  const { title, body, created_by } = req.body;
  Article.insertMany([{ title, body, created_by, belongs_to: topic_slug }])
    .then(article => {
      res.status(201).send({ article: article[0] });
    })
    .catch(next);
};

const getAllArticles = (req, res, next) => {
  return Article.find()
    .then(articlesDocs => {
      return Promise.all([
        articlesDocs,
        ...articlesDocs.map(article => {
          return Comment.count({ belongs_to: article._id }).then(comment => {
            return comment;
          });
        })
      ]);
    })
    .then(([articlesDocs, ...count]) => {
      articles = [];
      articlesDocs.forEach((article, i) => {
        articles.push({
          _id: article._id,
          title: article.title,
          body: article.body,
          belongs_to: article.belongs_to,
          votes: article.votes,
          created_by: article.created_by,
          comments: count[i],
          _v: article._v
        });
      });
      return articles;
    })
    .then(articles => {
      res.send({ articles });
    });
};

const getArticleByArticleId = (req, res, next) => {
  const { id } = req.params;
  Article.find({ _id: id })
    .then(articleArr => {
      console.log(articleArr[0]);
      if (articleArr[0] === undefined) {
        next({
          status: 404,
          message: "err: Page not found, invalid article ID"
        });
      } else {
        article = articleArr[0];
        res.send(article);
      }
    })
    .catch(next);
};

const getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .then(comments => {
      comments[0] === undefined
        ? next({
            status: 404,
            message: `error:404 ${article_id} not present in database`
          })
        : res.send({ comments });
    })
    .catch(next);
};

const postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, created_by } = req.body;
  Comment.insertMany([{ body, created_by, belongs_to: article_id }])
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};

const changeArticleVoteCount = (req, res, next) => {
  const { id } = req.params;
  const { vote } = req.query;
  let direction;
  if (vote === "up") direction = 1;
  else if (vote === "down") direction = -1;
  else direction = 0;
  Article.findByIdAndUpdate(id, { $inc: { votes: direction } }, { new: true })
    .then(article => {
      res.status(202).send(article);
    })
    .catch(next);
};

const changeCommentVoteCount = (req, res, next) => {
  const { id } = req.params;
  const { vote } = req.query;
  let direction;
  if (vote === "up") direction = 1;
  else if (vote === "down") direction = -1;
  else direction = 0;
  Comment.findByIdAndUpdate(id, { $inc: { votes: direction } }, { new: true })
    .then(Comment => {
      res.status(202).send(Comment);
    })
    .catch(next);
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username }).then(([user]) => {
    user === undefined
      ? next({
          status: 404,
          message: `error:404 ${username} not present in database`
        })
      : res.send(user);
  });
};

const deleteComment = (req, res, next) => {
  const { id } = req.params;
  Comment.findByIdAndRemove(id)
    .then(comment => {
      res.status(202).send({ msg: `${id} sucessfully deleted` });
    })
    .catch(console.log);
};

module.exports = {
  getAllTopics,
  getAllArticles,
  postNewArticle,
  getArticlesByTopic,
  getArticleByArticleId,
  getCommentsForArticle,
  postNewComment,
  changeArticleVoteCount,
  changeCommentVoteCount,
  deleteComment,
  getUserByUsername
};
