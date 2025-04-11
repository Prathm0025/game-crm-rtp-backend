"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.User = exports.PlayerSchema = exports.UserSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    status: { type: String, default: "active" },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ["admin", "supermaster", "master", "distributor", "subdistributor", "store"]
    },
    subordinates: [
        { type: mongoose_1.default.Types.ObjectId, refPath: "subordinateModel" },
    ],
    transactions: [{ type: mongoose_1.default.Types.ObjectId, ref: "Transaction" }],
    lastLogin: { type: Date, default: null },
    loginTimes: { type: Number, default: 0 },
    totalRecharged: { type: Number, default: 0 },
    totalRedeemed: { type: Number, default: 0 },
    credits: { type: Number, required: true },
    createdBy: { type: mongoose_1.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
exports.UserSchema.virtual("subordinateModel").get(function () {
    const rolesHierarchy = {
        admin: "User",
        supermaster: "User",
        master: "User",
        distributor: "User",
        subdistributor: "User",
        store: "Player",
    };
    return rolesHierarchy[this.role];
});
exports.PlayerSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "player", immutable: true },
    status: { type: String, default: "active" },
    lastLogin: { type: Date, default: null },
    loginTimes: { type: Number, default: 0 },
    totalRecharged: { type: Number, default: 0 },
    totalRedeemed: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    favouriteGames: { type: [String], default: [] },
    transactions: [{ type: mongoose_1.default.Types.ObjectId, ref: "Transaction" }],
    createdBy: { type: mongoose_1.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
const User = mongoose_1.default.model("User", exports.UserSchema);
exports.User = User;
const Player = mongoose_1.default.model("Player", exports.PlayerSchema);
exports.Player = Player;
