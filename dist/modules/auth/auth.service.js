"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    constructor() { }
    register = (req, res) => {
        return res.status(201).json({
            message: "User registered successfully",
            user: { ...req.body },
        });
    };
    login = (req, res) => { };
}
exports.default = new AuthService();
