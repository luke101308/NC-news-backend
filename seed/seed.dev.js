const seedDB = require("./seed");
const mongoose = require("mongoose");
const DB_URL = require("../config/devDB");
const { data } = require("./data/devData");

mongoose
  .connect(DB_URL)
  .then(() => {
    return seedDB(data);
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
