const router = require('express').Router();
const korisnik = require('../models/korisniciModel');
const bcrypt = require('bcryptjs'); // hesiranje lozinke
const jwt = require("jsonwebtoken"); // za logovanje token
const authMiddleware = require('../middlewares/authMiddleware');
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");

// Registracija novi korisnik

router.post('/register', async (req, res) => {
    // console.log('body', req.body)
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
        const rezultat = await noviKorisnik.save();
        // Za email verifikaciju 
        // console.log("OVDE USLO")
        await sendEmail(rezultat, "verifyemail");
        res.json({
            message: 'Registracija je uspela, molimo Vas verifikujte e-mail',
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
        // Proverava je li korisnik verifikovan
        if (!korisnikPostoji.isVerifyed) {
            return res.json({
                message: "Vaš email nije verifikovan",
                success: false,
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
            korisnikPostoji.lozinka,
        );
        if (!lozinkaSePodudara) {
            return res.json({
                message: "Netačna lozinka",
                succes: false,
                data: null,
            });
        }
        const token = jwt.sign(
            { userId: korisnikPostoji._id },
            // tajni kljuc smesten u .env
            process.env.jwt_skriven,
            { expiresIn: "5h", }
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
// ------------------------------------------------------------------------------------------------------------------------
// Dohvati podatke od korisnika 
router.post("get-user-info-by-id", authMiddleware, async (req, res) => {
    try {
        console.log(req.body.userId)
        const user = await korisnik.findById({ _id: req.body.userId });
        res.status(200).send({ message: "Podaci od korisniku su uspešno dohvaćeni", success: true, data: user, });

    } catch (error) {
        res.status(500).send({ message: "Podaci o korisniku nisu dohvaćeni", success: false, error });
    }
});


// Update user
router.put("/update-user", authMiddleware, async (req, res) => {
    try {
        console.log(req.body.userId)
        const user = await korisnik.findByIdAndUpdate({ _id: req.body.userId }, { ime: req.body.ime, email: req.body.email });
        const newUser = await korisnik.findById(req.body.userId)
        res.status(200).send({ message: "Korisnik je uspešno izmenjen", success: true, data: newUser });

    } catch (error) {
        res.status(500).send({ message: "Korisninički podaci nisu izmenjeni", success: false, error });
    }
});
// Update pass on profile
router.put("/update-password", authMiddleware, async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await korisnik.findByIdAndUpdate({ _id: req.body.userId }, { lozinka: hashedPassword });
        res.status(204).send({ message: "Korisnik je uspešno izmenjen", success: true });

    } catch (error) {
        res.status(500).send({ message: "Korisninički podaci nisu izmenjeni", success: false, error });
    }
});
// -----------------------------------------------------------------------------------------------------------------------------

// Admin panel, manipulacija sa korisnicima
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


// Slanje reset pasvord linka
router.post("/send-password-reset-link", async (req, res) => {
    try {
        const result = await korisnik.findOne({ email: req.body.email });
        await sendEmail(result, "resetpassword");
        res.send({
            success: true,
            message: "Restart pasvord link je uspešno poslat na mejl",
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Restart lozinke
router.post("/reset-password", async (req, res) => {
    try {
        // console.log("sifra je",req.body.password)
        const tokenData = await Token.findOne({ token: req.body.token });
        if (tokenData) {
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            let result = await korisnik.findById(tokenData.userid);
            result.lozinka = hashedPassword;
            await result.save();
            await Token.findOneAndDelete({ token: req.body.token });
            res.send({ success: true, message: "Pasword je uspešno restartovan" });
        } else {
            res.send({ success: false, message: "Neispravan token" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});


// Verifikacija mejla
router.post("/verify-email", async (req, res) => {
    try {
        const tokenData = await Token.findOne({ token: req.body.token });
        if (tokenData) {

            const user = await korisnik.findById(tokenData.userid)


            user.isVerifyed = true;
            await user.save();
            await Token.findOneAndDelete({ token: req.body.token });
            res.send({ success: true, message: "Email je uspešno verifikovan!" })
        } else {
            res.send({ success: false, message: "Neispravan token" })
        }
    } catch (error) {
        res.status(500).send(error);
    }
});







module.exports = router