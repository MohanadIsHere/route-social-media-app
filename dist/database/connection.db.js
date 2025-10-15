"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const env_1 = require("../config/env");
const chalk_1 = __importDefault(require("chalk"));
const models_1 = require("./models");
const connectToDatabase = async () => {
    try {
        await (0, mongoose_1.connect)(env_1.DB_URI);
        await models_1.userModel.syncIndexes();
        console.log(chalk_1.default.green.bold("Connected to MongoDB Server Successfully ✅"));
    }
    catch (error) {
        console.error(chalk_1.default.red.bold("Error connecting to MongoDB Server:"), error);
    }
};
exports.default = connectToDatabase;
