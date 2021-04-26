"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var post_1 = require("./../controllers/post");
var auth_1 = require("./../controllers/auth");
var router = express_1.default.Router();
router.post("/create", auth_1.authorize, post_1.createPost);
router.get("/", auth_1.OnlyUser, post_1.getAllPosts);
router.get("/:identifier/:slug", auth_1.OnlyUser, post_1.singlePost);
exports.default = router;
//# sourceMappingURL=postRoute.js.map