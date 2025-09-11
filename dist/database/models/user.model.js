"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserProviders = exports.UserRoles = exports.UserGenders = void 0;
const mongoose_1 = require("mongoose");
var UserGenders;
(function (UserGenders) {
    UserGenders["male"] = "male";
    UserGenders["female"] = "female";
})(UserGenders || (exports.UserGenders = UserGenders = {}));
var UserRoles;
(function (UserRoles) {
    UserRoles["user"] = "user";
    UserRoles["admin"] = "admin";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
var UserProviders;
(function (UserProviders) {
    UserProviders["system"] = "system";
    UserProviders["google"] = "google";
})(UserProviders || (exports.UserProviders = UserProviders = {}));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, minLength: 2, maxLength: 25 },
    middleName: { type: String, minLength: 2, maxLength: 25 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 25 },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            return this.provider === UserProviders.google ? false : true;
        },
    },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: UserGenders, default: UserGenders.male },
    role: { type: String, enum: UserRoles, default: UserRoles.user },
    confirmed: { type: Boolean },
    otp: { type: String },
    profilePicture: { type: String },
    coverImages: [String],
    provider: {
        type: String,
        enum: UserProviders,
        default: UserProviders.system,
    },
    confirmEmailOtp: { type: String },
    resetPasswordOtp: { type: String },
    confirmedAt: { type: Date },
    changeCredentialsAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema
    .virtual("username")
    .set(function (val) {
    const [firstName, middleName, lastName] = val.split(" ");
    if (middleName)
        this.set({ firstName, middleName, lastName });
    else
        this.set({ firstName, lastName });
})
    .get(function () {
    return this.middleName
        ? `${this.firstName} ${this.middleName} ${this.lastName}`
        : `${this.firstName} ${this.lastName}`;
});
exports.User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
