const bcrypt = require('bcryptjs'); // hesiranje lozinke
const nodemailer = require("nodemailer");
const Token = require("../models/tokenModel");

module.exports = async (user, mailType) => {

    try {
        // Nodemailer config
        // Vazno: na gmail u podesavanja konfigurisati da moze da se prima mejl, lozinku enkriptovanu dobijamo tako sto na gugl nalog ukljucimo 2-factor auth i tamo dobijemo lozinku i ubacimo u polje pass: ispod
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "webus.official2022@gmail.com",
                pass: "znqjpksrkrsypgin",
            },
            log: true,
        });

        // Kreiranje i heširanje tokena
        const encryptedToken = bcrypt.hashSync(user._id.toStrnig(), 69).replaceAll('/', "");
        const token = new Token({ userid: user._id, token: encryptedToken, });
        await token.save();

        // Izgled poruke koja stize korisniku
        const emailContent = `<div><h1>Molimo Vas, kliknite ispod na link kako bi verifikovali e-mail adresu</h1> <a href="http://localhost:3000/verifyemail/${encryptedToken}">${encryptedToken}</a> </div>`;

        // Format slanja mejla
        const mailOptions = {
            from: "webus.official2022@gmail.com",
            to: user.email,
            subject: "WEBUS - Verifikovanje e-pošte",
            html: emailContent,
        }
        // Ubaceno u korisniciRuta.js endppoint /register ispod noviKorisnik.save(). 
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};