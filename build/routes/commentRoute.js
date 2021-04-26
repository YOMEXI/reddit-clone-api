"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var comment_1 = require("./../controllers/comment");
var auth_1 = require("./../controllers/auth");
var router = express_1.default.Router();
router.post("/:identifier/:slug/comment", auth_1.authorize, comment_1.createComment);
router.get("/:identifier/:slug/comment", auth_1.OnlyUser, comment_1.getApostComments);
exports.default = router;
//# sourceMappingURL=commentRoute.js.map