const { validationResult } = require("express-validator");
const UserModel = require("../models/User");
const { hashedPassword, createToken, comparePassword } = require("../services/authServices");

// @routes post /api/register
// @access public
// @description create user and return a token

module.exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { name, email, password } = req.body;
        try {
            const emailExist = await UserModel.findOne({ email });
            if (!emailExist) {
                const hashed = await hashedPassword(password);
                const user = await UserModel.create({
                    name,
                    email,
                    password: hashed,
                });
                const token = createToken({id: user._id, name: user.name});
                return res.status(201).json({ msg: 'Your account has been created!', token });
            } else {
                // email already taken
                return res.status(400).json({ errors: [{ msg: `${email} is already taken!`,
            path: 'email' }] })
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json("Server internal error!");
        }
    } else {
        // validation failed
        return res.status(400).json({ errors: errors.array() })
    }
}


// @routes post /api/login
// @access public
// @description login user and return a token

module.exports.login = async (req, res) => {
    const {email, password} = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const user = await UserModel.findOne({email});
            if (user) {
                if ( await comparePassword(password, user.password)) {
                    const token = createToken({id: user._id, name: user.name})
                    if (user.admin) {
                        return res.status(201).json({token, admin: true});
                    } else {
                        return res.status(201).json({token, admin: false});
                    }
                }else{
                    return res.status(400).json({errors: [{msg: 'password not matched!', path: 'password'}]})
                }
            }else{
                return res.status(400).json({errors: [{msg: `${email} is not found!`, path: 'email'}]}
                );
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json('srever internal error!');
        }
    }else{
        // validations failed
        return res.status(400).json({errors: errors.array()})
    }
}