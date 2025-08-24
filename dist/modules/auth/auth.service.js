"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    constructor() { }
    register = (req, res) => {
        const { username, email, password } = req.body;
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                username,
                email,
                password
            },
        });
    };
    login = (req, res) => { };
}
exports.default = new AuthService();
