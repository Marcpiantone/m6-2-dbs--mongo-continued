"use strict";
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const { MongoClient } = require("mongodb");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

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
          numOfRows: 8,
          seatsPerRow: 12,
        });
      } else {
        res.status(404).json({ data: "Seats not found, 404" });
      }
    });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }

  client.close();
};

const handleBooking = async (req, res) => {
  console.log(req.body);
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  const client = await MongoClient(MONGO_URI, options);

  const _id = seatId;

  const query = { _id };
  const newValues = {
    $set: { isBooked: true, bookedBy: fullName, email: email },
  };

  console.log(query);
  console.log(newValues);

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: "Please provide credit card information!",
    });
  }

  try {
    await client.connect();
    const db = client.db("m6-2");
    const collection = db.collection("seats");

    const seat = await collection.findOne({ _id });
    const bookingStatus = seat.isBooked;

    if (bookingStatus === false) {
      const r = await collection.updateOne(query, newValues);
      assert.equal(1, r.matchedCount);
      assert.equal(1, r.modifiedCount);
      return res.status(200).json({
        status: 200,
        success: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "This seat has already been booked!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteBooking = async (req, res) => {
  const _id = req.params._id.toUpperCase();
  const query = { _id };
  const modifiedValues = {
    $set: { isBooked: false },
    $unset: { bookedBy: "", email: "" },
  };

  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("m6-2");
    const collection = db.collection("seats");

    const r = await collection.updateOne(query, modifiedValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    return res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ status: 500, _id, data: err.message });
  }
};

const updateBooking = async (req, res) => {
  const _id = req.params._id;
  const query = { _id };
  const fullNameTemp1 = req.body.fullName;
  const emailTemp1 = req.body.email;
  console.log(_id);

  const modifiedName =
    fullNameTemp1 !== undefined ? { fullNameTemp: fullNameTemp1 } : {};
  const modifiedEmail =
    emailTemp1 !== undefined ? { emailTemp: emailTemp1 } : {};
  const fullName = modifiedName.fullNameTemp;
  const email = modifiedEmail.emailTemp;

  const modifiedValues = { $set: { fullName, email } };
  console.log(modifiedValues);
  return res.status(200).json({ message: "bacon" });
};

module.exports = { getSeats, handleBooking, deleteBooking, updateBooking };
