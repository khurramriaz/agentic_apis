const mongoose = require('mongoose');
require('dotenv').config();
const Utility = require("../lib/utility");


async function connectDB() {
  const { MONGO_DB_USER, MONGO_DB_PASS, MONGO_URI, MONGO_DB } = Utility.env();
  const uri = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASS}@${MONGO_URI}/${MONGO_DB}`;
  await mongoose.connect(uri);
  console.log('Database Connected...')
}

module.exports = { connectDB };
