const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config({ path: "../.env" });

const dbUrl = process.env.ATLASDB_URL || "mongodb+srv://prachi:prachi123@cluster0.mongodb.net/test?retryWrites=true&w=majority";

main().then(() => console.log("DB connected for init")).catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67f9a2c1e5b4c8a1d2e3f4a5", // dummy owner, nantar signup kelavar change hoil
    image: { url: obj.image.url, filename: "listingimage" },
    geometry: { type: "Point", coordinates: [77.2090, 28.6139] }
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized - 14 listings added");
};

initDB().then(() => mongoose.connection.close());