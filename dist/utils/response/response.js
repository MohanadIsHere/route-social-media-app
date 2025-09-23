"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = exports.ConflictException = exports.ForbiddenException = exports.UnauthorizedException = exports.NotFoundException = exports.BadRequestException = exports.AppException = void 0;
class AppException extends Error {
    statusCode;
    constructor(message, statusCode, options) {
        super(message, options);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.AppException = AppException;
class BadRequestException extends AppException {
    constructor(message, options) {
        super(message, 400, options);
        this.name = this.constructor.name;
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends AppException {
    constructor(message, options) {
        super(message, 404, options);
        this.name = this.constructor.name;
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends AppException {
    constructor(message, options) {
        super(message, 401, options);
        this.name = this.constructor.name;
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends AppException {
    constructor(message, options) {
        super(message, 403, options);
        this.name = this.constructor.name;
    }
}
exports.ForbiddenException = ForbiddenException;
class ConflictException extends AppException {
    constructor(message, options) {
        super(message, 409, options);
        this.name = this.constructor.name;
    }
}
exports.ConflictException = ConflictException;
class SuccessResponse {
    static ok({ res, message = "Success", statusCode = 200, data = {}, }) {
        return res.status(statusCode).json({
            message,
            success: true,
            statusCode,
            data,
        });
    }
    static created({ res, message = "Success", statusCode = 201, data = {}, }) {
        return res.status(statusCode).json({
            message,
            success: true,
            statusCode,
            data,
        });
    }
}
exports.SuccessResponse = SuccessResponse;
