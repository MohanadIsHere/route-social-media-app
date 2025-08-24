"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", (req, res, next) => {
    return res.status(201).json({ message: "User registered successfully" });
});
authRouter.post("/login", (req, res, next) => {
    return res.status(200).json({ message: "User logged in successfully" });
});
exports.default = authRouter;
