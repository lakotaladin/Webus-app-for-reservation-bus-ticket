const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
const { route } = require("./korisniciRuta");
const stripe = require("stripe")(process.env.stripe_key);
const { v4: uuidv4 } = require("uuid");


// Rezerviši sedište
router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.body.userId,
    });
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();
    res.status(200).send({
      message: "Rezervacija karte je uspela",
      data: newBooking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Rezervacija karte nije uspela",
      data: error,
      success: false,
    });
  }
});


// plaćanje

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: amount,
        currency: "eur",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.status(200).send({
        message: "Plaćanje je uspelo",
        data: {
          transactionId: payment.source.id,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        message: "Plaćanje nije uspelo",
        data: error,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Plaćanje nije uspelo",
      data: error,
      success: false,
    });
  }
});

// Pokupi rezervacije po korisnik-id

router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("bus")
      .populate("user");
    res.status(200).send({
      message: "Rezervacije po korisniku su uspešno dohvaćene",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Rezervacije po korisniku nisu dohvaćene",
      data: error,
      success: false,
    });
  }
});


// Uhvati sve autobuse
router.post("/get-all-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");
    res.status(200).send({
      message: "Reyervacije su uspešno dohvaćene",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Rezervacije nisu dohvaćene",
      data: error,
      success: false,
    });
  }
});

module.exports = router;