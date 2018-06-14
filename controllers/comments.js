const { Comment } = require("../models");

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
 
const deleteComment = (req, res, next) => {
    const { id } = req.params;
    Comment.findByIdAndRemove(id)
      .then(comment => {
        res.status(202).send({ msg: `${id} sucessfully deleted` });
      })
      .catch(next);
  };
  

module.exports =  
    { 
    getCommentsForArticle,
    postNewComment,
    changeCommentVoteCount,
    deleteComment
    }