"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    constructor() { }
    me = (req, res, next) => {
        return res.status(200).json({
            message: "User Retrieved Successfully",
            data: { user: req.user, decoded: req.decoded },
        });
    };
}
exports.default = new UserService();
