const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // Kada tokena nema
        if (!token) {
            return res.status(401).send({
                message: "Autentikacija nije uspela.",
                success: false,
            });
        }
        // validacija tokena
        const decoded = jwt.verify(token, process.env.jwt_skriven);
        req.body.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).send({
            message: "Autentikacija nije uspela.",
            success: false,
        });
    }
}