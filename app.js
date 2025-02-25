"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./src/server"));
const db_1 = __importDefault(require("./src/config/db"));
const config_1 = require("./src/config/config");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    // const patforms = await Platform.find();
    // for (const platform of patforms) {
    //   let order = 1;
    //   for (const game of platform.games) {
    //     game.order = order++;
    //   }
    //   await platform.save();
    //   console.log("Game order updated successfully");
    // }
    server_1.default.listen(config_1.config.port, () => {
        console.log("Listening on port : ", config_1.config.port);
    });
});
startServer();
