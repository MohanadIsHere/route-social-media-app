"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
class AuthService {
    constructor() { }
    register = (req, res) => {
        const { username, email, password } = req.body;
        throw new utils_1.BadRequestException("Invalid user data", {});
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: "generated-user-id",
                username,
                email,
                password
            },
        });
    };
    login = (req, res) => { };
}
exports.default = new AuthService();
