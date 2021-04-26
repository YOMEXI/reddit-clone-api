"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("../controllers/auth");
var vote_1 = require("../controllers/vote");
var router = express_1.default.Router();
router.post("/vote", auth_1.authorize, vote_1.vote);
exports.default = router;
//# sourceMappingURL=miscRoute.js.map