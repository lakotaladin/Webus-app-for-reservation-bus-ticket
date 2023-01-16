const router = require('express').Router();
const korisnik = require('../models/korisniciModel');
const bcrypt = require('bcryptjs'); // hesiranje lozinke
const jwt = require("jsonwebtoken"); // za logovanje token
const authMiddleware = require('../middlewares/authMiddleware');
// const nodemailer = require("nodemailer");


// Email config

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: "webus.official2022@gmail.com",
//         pass: "znqjpksrkrsypgin",
//     },
//     log: true,
// });


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

// Slanje email linka za restartovanje lozinke

// router.post("/sendpasswordlink", async (req, res) => {
//     console.log(req.body)

//     const { email } = req.body;

//     if (!email) {
//         res.status(401).json({ status: 401, message: "Unesite Vaš email" })
//     }

//     try {
//         const userfind = await korisnik.findOne({ email: email });
//         // console.log("userfind",userfind)
//         if (!userfind) {
//             res.status(404).end();
//             return;
//         }

//         // generisanje tokena za resetovanje pasvorda

//         const token = jwt.sign({ _id: userfind._id }, process.env.jwt_skriven, {
//             expiresIn: "300s"
//         });

//         console.log("token", token);
        // U bazu kod korisnika je dodato verifytoken
        // const setusertoken = await korisnik.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true });
        // console.log("usertoken", setusertoken);

        // const mailOptions = {
        //     from: "webus.official2022@gmail.com",
        //     to: email,
        //     subject: "WEBUS - Restartovanje lozinke",
        //     text: `Ovaj važeći link ističe za 5min -> https://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`,
        // }

        // transporter.sendMail(mailOptions, (error, info) => {

        //     if (error) {
        //         console.log("error", error);
        //         res.status(401).json({ status: 401, message: "Email nije poslat!" });
                //   return res.send({
                //         message: "Email nije poslat!",
                //         success: false,
                //         data: mailOptions,
                //     });
//             } else {
//                 console.log("Email je poslat!", info.response);
//                 res.status(201).json({ status: 201, message: "Email je uspešno poslat!" });
//             }

//         });

//     } catch (error) {
//         res.status(401).json({ status: 401, message: "Nepostojeći korisnik" });
//     }

// });

// verifikovanje korisnika za zaboravljenu lozinku

// router.get("/forgotpassword/:id/:token", async(req, res) =>{
//     const {id, token} = req.params;
//     // console.log(id,token);
//     try {
//         const validuser = await korisnik.findOne({_id:id,verifytoken:token});
//         // console.log(validuser);
//         const verifyToken = jwt.verify(token, process.env.jwt_skriven);

//         if(validuser && verifyToken._id){
//             res.status(201).json({status:201, validuser, token: verifyToken})
//         }else{
//             res.status(401).json({status:401, message:"Korisnik ne postoji"})
//         }
//     } catch (error) {
//         res.status(401).json({status:401, error})
//     }
// });


// Promeni lozniku korisniku

// router.post("/:id/:token", async(req, res) => {
//     const {id, token} = req.params;

//     const {password} = req.body;

//     try {
//         const validuser = await korisnik.findOne({_id:id, verifytoken:token});

//         const verifyToken = jwt.verify(token, process.env.jwt_skriven);

//         if(validuser && verifyToken._id){
//             const newpassword = await bcrypt.hash(password, 12)

//             const setnewuserpass = await korisnik.findByIdAndUpdate({_id:id}, {lozinka:newpassword});

//             setnewuserpass.save(); 
//             res.status(201).json({status:201, setnewuserpass})
//         }else{
//             res.status(401).json({status:401, message:"Korisnik ne postoji"})
//         }

//     } catch (error) {
//         res.status(401).json({status:401, error})
//     }
// });





module.exports = router