"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.UserProviders = exports.UserRoles = exports.UserGenders = void 0;
const mongoose_1 = require("mongoose");
const hash_1 = require("../../utils/security/hash");
const encryption_1 = require("../../utils/security/encryption");
const env_1 = require("../../config/env");
const templates_1 = require("../../utils/templates");
const email_events_1 = require("../../utils/events/email.events");
const eventEmitter_1 = require("../../utils/events/eventEmitter");
var UserGenders;
(function (UserGenders) {
    UserGenders["male"] = "male";
    UserGenders["female"] = "female";
})(UserGenders || (exports.UserGenders = UserGenders = {}));
var UserRoles;
(function (UserRoles) {
    UserRoles["user"] = "user";
    UserRoles["admin"] = "admin";
    UserRoles["superAdmin"] = "superAdmin";
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
    profileImage: { type: String },
    tmpProfileImage: { type: String },
    otpExpiresIn: { type: Date },
    coverImages: [String],
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    provider: {
        type: String,
        enum: UserProviders,
        default: UserProviders.system,
    },
    confirmEmailOtp: { type: String },
    resetPasswordOtp: { type: String },
    confirmedAt: { type: Date },
    changeCredentialsAt: { type: Date },
    freezedAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    strictQuery: true,
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
userSchema.pre("save", async function (next) {
    if (this.isModified("password") &&
        this.password &&
        this.provider !== UserProviders.google) {
        this.password = await (0, hash_1.hashText)({
            plainText: this.password,
        });
    }
    if (this.isModified("phone") && this.phone) {
        this.phone = (0, encryption_1.encryptText)({ cipherText: this.phone });
    }
    if (this.isNew && !this.confirmed && this.provider !== UserProviders.google) {
        plainOtp = (0, email_events_1.otpGen)();
        this.confirmEmailOtp = await (0, hash_1.hashText)({ plainText: plainOtp });
    }
    next();
});
let plainOtp = "";
userSchema.post("save", function (doc) {
    if (!doc.confirmed && doc.provider !== UserProviders.google && plainOtp) {
        eventEmitter_1.emailEvents.emit("sendEmail", {
            from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
            to: doc.email,
            subject: "Email Verification",
            text: "Please verify your email address.",
            html: templates_1.emailTemplates.verifyEmail({
                otp: plainOtp,
                firstName: doc.firstName,
            }),
        });
        plainOtp = null;
    }
});
exports.userModel = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
