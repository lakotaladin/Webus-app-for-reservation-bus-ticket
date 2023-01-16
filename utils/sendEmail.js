const nodemailer = require("nodemailer");

module.exports = (user, mailType) => {

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

    const mailOptions = {
        from: "webus.official2022@gmail.com",
        to: user.email,
        subject: "WEBUS - Verifikovanje e-pošte",
        content: "Molimo Vas, verifikujte mejl",
    }

    await transporter.sendMail(mailOptions)
};