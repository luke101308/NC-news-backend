const path = process.env.NODE_ENV || "dev";

module.exports = require(`./${path}DB`);
