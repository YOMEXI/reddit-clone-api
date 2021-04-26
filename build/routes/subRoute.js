"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("./../controllers/auth");
var sub_1 = require("./../controllers/sub");
var router = express_1.default.Router();
router.post("/creates", auth_1.authorize, sub_1.createSub);
router.post("/image/:name", auth_1.authorize, auth_1.UserOwnSub, sub_1.SubImage);
router.get("/popular", sub_1.popularSub);
router.get("/:name", auth_1.OnlyUser, sub_1.oneSub);
router.get("/search/:name", sub_1.Search);
exports.default = router;
//# sourceMappingURL=subRoute.js.map