const { User } = require("../models");

const getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    User.findOne({ username: username })
      .then((user) => {
        user === null
          ? next({
              status: 404,
              message: `error:404 ${username} not present in database`
            })
          : res.send({user});
      })
      .catch(next);
  };

  
  module.exports = {getUserByUsername}