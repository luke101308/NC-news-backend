const {Article, Comment} = require("../models");

const getAllArticles = (req, res, next) => {
    return Article.find().populate("created_by")
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
       const articles = articlesDocs.map((article, i) => {
         formattedArticle = {
            _id: article._id,
            title: article.title,
            body: article.body,
            belongs_to: article.belongs_to,
            votes: article.votes,
            created_by: article.created_by,
            comments: count[i],
            _v: article._v
          };
          return formattedArticle
        });
        res.send({ articles });
      })
      .catch(next);
  };
  
  const getArticleByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    Article.findById(article_id).populate("created_by")
      .then(article => {
        if (article === null) {
          next({
            status: 404,
            message: "err: Page not found, invalid article ID"
          });
        } else {
          res.send({article});
        }
      })
      .catch(next);
  };
  
const changeArticleVoteCount = (req, res, next) => {
    const { article_id } = req.params;
    const { vote } = req.query;
    let direction;
    if (vote === "up") direction = 1;
    else if (vote === "down") direction = -1;
    else direction = 0;
    Article.findByIdAndUpdate(article_id, { $inc: { votes: direction } }, { new: true })
      .then(article => {
        res.status(202).send({article});
      })
      .catch(next);
  };

  const getArticlesByTopic = (req, res, next) => {
    const { topic_slug } = req.params;
    Article.find({ belongs_to: topic_slug }).populate("created_by")
      .then(articlesDocs => {
        if (articlesDocs[0] === undefined) {
          next({
            status: 404,
            message: `error:404 ${topic_slug} not present in database`
          });
        } else {
          return Promise.all([
            articlesDocs,
            ...articlesDocs.map(article => {
              return Comment.count({ belongs_to: article._id }).then(comment => {
                return comment;
              });
            })
          ]);
        }
      })
      .then(([articlesDocs, ...count]) => {
        const articles = articlesDocs.map((article, i) => {
          formattedArticle = {
            _id: article._id,
            title: article.title,
            body: article.body,
            belongs_to: article.belongs_to,
            votes: article.votes,
            created_by: article.created_by,
            comments: count[i],
            _v: article._v
          }
          return formattedArticle
        });
        res.send({ articles });
      })
      .catch(next);
  };
  
  const postNewArticle = (req, res, next) => {
    const { topic_slug } = req.params;
    const { title, body, created_by } = req.body;
    const article = new Article({ title, body, created_by, belongs_to: topic_slug }) 
    article.save()
    .then(article => {
        res.status(201).send({ article });
      })
      .catch(next);
  };
  

module.exports = {
    getArticlesByTopic,
    postNewArticle,
    getAllArticles,
    getArticleByArticleId,
    changeArticleVoteCount
}