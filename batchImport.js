const { fs } = require("file-system");
const assert = require("assert");
const { MongoClient, Db } = require("mongodb");
const { json } = require("express");
const request = require("request");
const http = require("http");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const seats = [];
  const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
  for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
      seats.push({
        _id: `${row[r]}-${s}`,
        price: 225,
        isBooked: false,
      });
    }
  }
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("m6-2");
    const collection = db.collection("seats");

    const r = await collection.insertMany(seats);
    assert.equal(seats.length, r.insertedCount);

    console.log(r);
  } catch (err) {
    console.log(err);
  }
  client.close();
};

batchImport();

// const migrateSeats = async () => {
//   const seats = await request(
//     "http://localhost:5678/api/seat-availability",
//     { json: true },
//     (err, res, body) => {
//       const seatArray = Object.keys(body.seats).map((i) => body.seats[i]);
//       console.log(seatArray);
//       //batchImport(seatArray);
//     }
//   );
//   return seats;
// };

//migrateSeats();
