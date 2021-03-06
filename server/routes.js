const router = require("express").Router();
//const { delay } = require("./helpers");

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;
const {
  getSeats,
  handleBooking,
  deleteBooking,
  updateBooking,
} = require("./handlers");

// Code that is generating the seats.
// ----------------------------------
// const seats = {};
// const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
// for (let r = 0; r < row.length; r++) {
//   for (let s = 1; s < 13; s++) {
//     seats[`${row[r]}-${s}`] = {
//       price: 225,
//       isBooked: false,
//     };
//   }
// }
// ----------------------------------
//////// HELPERS
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

router.get("/api/seat-availability", getSeats);

// const seats=[{_id: 'A-1', isbooked:false},{}]
// const formattedSeats ={}
// seats.forEach(seat=>{
//   formattedSeats[seat._id].isBooked = seat.isBooked
// })
// {A-1:{_id: 'A-1', isbooked:false}}

//await delay(Math.random() * 3000);

//let lastBookingAttemptSucceeded = false;

router.post("/api/book-seat", handleBooking);

// async (req, res) => {
//   const { seatId, creditCard, expiration } = req.body;

//   if (!state) {
//     state = {
//       bookedSeats: randomlyBookSeats(30),
//     };
//   }

//   //await delay(Math.random() * 3000);

//   const isAlreadyBooked = !!state.bookedSeats[seatId];
//   if (isAlreadyBooked) {
//     return res.status(400).json({
//       message: "This seat has already been booked!",
//     });
//   }

//   if (!creditCard || !expiration) {
//     return res.status(400).json({
//       status: 400,
//       message: "Please provide credit card information!",
//     });
//   }

//   if (lastBookingAttemptSucceeded) {
//     lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

//     return res.status(500).json({
//       message: "An unknown error has occurred. Please try your request again.",
//     });
//   }

//   lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

//   state.bookedSeats[seatId] = true;

//   return res.status(200).json({
//     status: 200,
//     success: true,
//   });
// });

router.put("/api/seat-availability/deletebooking/:_id", deleteBooking);
router.put("/api/seat-availability/updatebooking/:_id", updateBooking);
module.exports = router;
