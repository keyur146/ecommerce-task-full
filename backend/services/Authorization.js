const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/envConfig")

class Authorization {
    authorized(req, res, next) {             //(req, res, next) these parameters are provided by Expressjs.

        const headerToken = req.headers.authorization;
        if (headerToken) {
            const token = headerToken.split('Bearer ')[1];
            const verified = jwt.verify(token, JWT_SECRET);     // token is verified by using the jwt.verify function
            if (verified) {
                next();                      //if the token is verified next function will start the further process.
            } else {
                return res.status(401).json({errors: [{msg: 'Please add a valid token'}]})
            }
        } else {
            return res.status(401).json({errors: [{msg: 'Please add a token'}]})
        }
    }
}

module.exports = new Authorization();