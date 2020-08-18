"use strict";
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const { MongoClient } = require("mongodb");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

let state;

if (!state) {
  state = {
    bookedSeats: randomlyBookSeats(30),
  };
}

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();

    const db = client.db("m6-2");
    const collection = db.collection("seats");

    const r = await collection.find().toArray((err, result) => {
      let formattedSeats = {};

      if (result !== []) {
        result.forEach((seat) => (formattedSeats[seat._id] = seat));
        res.status(200).json({
          seats: formattedSeats,
          bookedSeats: state.bookedSeats,
          numOfRows: 8,
          seatsPerRow: 12,
        });
      } else {
        res.status(404).json({ data: "Not found, 404" });
      }
    });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }

  client.close();
};

module.exports = { getSeats };
