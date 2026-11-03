const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb+srv://prachipalaskar45_db_user:prachi12345@cluster0.bacypie.mongodb.net/wanderlust?retryWrites=true&w=majority";

main().then(() => {
  console.log("connected to DB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("68f0a1b2c3d4e5f6a7b8c9d0"),
  }));
  await Listing.insertMany(updatedData);
  console.log("data was initialized");
};

initDB();