const seedDB = require("./seed");
const mongoose = require("mongoose");
const DB_URL = require("../config");
const rawData = require("./data");

mongoose
  .connect(DB_URL)
  .then(() => {
    return seedDB(rawData);
  })
  .then(() => {
    console.log("DB seeded");
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log("DB disconnected");
  });
