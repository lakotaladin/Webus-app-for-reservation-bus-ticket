const router = require('express').Router();
const korisnik = require('../models/korisniciModel');
const bcrypt = require('bcryptjs'); // hesiranje lozinke
const jwt = require("jsonwebtoken"); // za logovanje token
const authMiddleware = require('../middlewares/authMiddleware');

// Registracija novi korisnik

router.post('/register', async (req, res) => {
    console.log('body', req.body)
    try {
        const postojeciKorisnik = await korisnik.findOne({ email: req.body.email });
        if (postojeciKorisnik) {
            return res.json({
                message: 'Email već postoji!',
                succes: false,
                data: null,
            });
        }
        //hesirana lozinka
        const hesiranaLozinka = await bcrypt.hash(req.body.lozinka, 10);
        req.body.lozinka = hesiranaLozinka;
        // Kreiranje korisnika

        const noviKorisnik = new korisnik(req.body);
        await noviKorisnik.save();
        res.json({
            message: 'Korisnik je uspešno kreiran',
            success: true,
            data: null,
        });

    } catch (error) {
        console.error(error);
        res.json({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// Logovanje korisnika
router.post("/login", async (req, res) => {
    try {
        const korisnikPostoji = await korisnik.findOne({ email: req.body.email });
        if (!korisnikPostoji) {
            return res.json({
                message: "Korisnik ne postoji",
                succes: false,
                data: null,
            });
        }


 // Provera da li je korisnik blokiran
        if (korisnikPostoji.isBlocked) {
            return res.json({
                message: "Vaš nalog je blokiran , molimo Vas kontaktirajte admina",
                success: false,
                data: null,
            });
        }


        // Uporedjuje da li se lozinka podudara sa kreiranom
        const lozinkaSePodudara = await bcrypt.compare(
            req.body.lozinka,
            korisnikPostoji.lozinka
        );
        if (!lozinkaSePodudara) {
            return res.json({
                message: "Netačna lozinka",
                succes: false,
                data: null,
            });
        }
        // jsonwebtoken kreiranje - samo enkriptovan userId
        const token = jwt.sign(
            { userId: korisnikPostoji._id },
            // tajni kljuc snesten u .env
            process.env.jwt_skriven,
            { expiresIn: "3h", }
        );

        res.send({
            message: "Korisnik je uspešno ulogovan",
            success: true,
            data: token
        });
    } catch (error) {
        console.error(error)
        res.json({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// get-user-by-id ovo se nalazi u ProtectedRoute.js

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
    // console.log(req)
    try {
        const user = await korisnik.findById(req.body.userId);
        res.json({
            message: "Korisnik je dohvaćen uspešno",
            success: true,
            data: user,
        });
    } catch (error) {
        res.json({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// Dohvati sve korisnike veb aplikacije
router.post("/get-all-users", authMiddleware, async (req, res) => {
    try {
        const users = await korisnik.find({ isDeleted: { $in: [false, null] } });
        res.send({
            message: "Korisnici su dohvaćeni uspešno",
            success: true,
            data: users,
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

//  Izmeni korisnika - dodaj/ukloni admina 

router.post("/update-user-permissions", authMiddleware, async (req, res) => {
    try {
        await korisnik.findByIdAndUpdate(req.body._id, req.body);
        res.send({
            message: "Korisničke dozvole su uspešno ažurirane",
            success: true,
            data: null,
        });
    } catch {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

module.exports = router