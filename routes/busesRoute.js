const router = require("express").Router();
const Bus = require('../models/busModel');
const authMiddleware = require("../middlewares/authMiddleware");
const { findByIdAndUpdate } = require("../models/busModel");
// Bibilioteka za dohvatanje gradova - za search bar
const _ = require('lodash')


// Dodaj autobus

router.post("/add-bus", authMiddleware, async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ number: req.body.number });
    if (existingBus) {
      return res.status(200).send({
        success: false,
        message: "Autobus već postoji",
      });
    }
    try {
      await Bus.create(req.body)
      return res.status(200).send({
        success: true,
        message: "Autobuska ruta je uspešno kreirana",
      });
    } catch (e) {
      return res.status(400).send({ success: false, message: e });
    }
  } catch (e) {
    res.status(500).send({ success: false, message: e });
  }
});


// Izmeni autobusku kartu

router.post("/update-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: "Ruta je izmenjena uspešno",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Brisanje autobuske karte
router.post("/delete-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Autobuska ruta je uspešno izbrisana",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Dodaj sve autobuse

router.post("/get-all-buses", authMiddleware, async (req, res) => {
  try {
    const buses = await Bus.find(req.body);
    return res.status(200).send({
      success: true,
      message: "Autobuske rute su uspešno dohvaćene",
      data: buses,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Dohvati sve gradove od kartica koje postoje u bazi
router.get("/get-all-cities", async (req, res) => {
  try {
    const buses = await Bus.find(req.body);
    return res.status(200).send({
      success: true,
      message: "Autobuske rute su uspešno dohvaćene",
      data: _.uniq(buses.flatMap(b => [b.from, b.to])),
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


// Uhvati bus po id-u
router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Autobuske karte su uspešno dohvaćene",
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});



module.exports = router;