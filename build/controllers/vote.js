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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vote = void 0;
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var Comment_1 = require("../entities/Comment");
var Post_1 = require("../entities/Post");
var Vote_1 = require("../entities/Vote");
var vote = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, identifier, slug, commentIdentifier, value, user, post, vote, comment;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, identifier = _a.identifier, slug = _a.slug, commentIdentifier = _a.commentIdentifier, value = _a.value;
                if (![-1, 0, 1].includes(value)) {
                    res.status(400);
                    throw new Error("Value must be -1,0,1");
                }
                user = req.user;
                return [4 /*yield*/, Post_1.Post.findOneOrFail({ identifier: identifier, slug: slug })];
            case 1:
                post = _b.sent();
                if (!commentIdentifier) return [3 /*break*/, 4];
                return [4 /*yield*/, Comment_1.Comment.findOneOrFail({ identifier: commentIdentifier })];
            case 2:
                comment = _b.sent();
                return [4 /*yield*/, Vote_1.Vote.findOne({ user: user, comment: comment })];
            case 3:
                vote = _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, Vote_1.Vote.findOne({ user: user, post: post })];
            case 5:
                vote = _b.sent();
                _b.label = 6;
            case 6:
                if (!(!vote && value === 0)) return [3 /*break*/, 7];
                res.status(400);
                throw new Error("Vote not found");
            case 7:
                if (!!vote) return [3 /*break*/, 9];
                vote = new Vote_1.Vote({ user: user, value: value });
                if (comment)
                    vote.comment = comment;
                else
                    vote.post = post;
                return [4 /*yield*/, vote.save()];
            case 8:
                _b.sent();
                return [3 /*break*/, 13];
            case 9:
                if (!(value == 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, vote.remove()];
            case 10:
                _b.sent();
                return [3 /*break*/, 13];
            case 11:
                if (!(vote.value !== value)) return [3 /*break*/, 13];
                vote.value = value;
                return [4 /*yield*/, vote.save()];
            case 12:
                _b.sent();
                _b.label = 13;
            case 13: return [4 /*yield*/, Post_1.Post.findOneOrFail({ identifier: identifier, slug: slug }, { relations: ["comments", "comments.votes", "sub", "votes"] })];
            case 14:
                post = _b.sent();
                post.setUserVote(user);
                post.comments.forEach(function (c) { return c.setUserVote(user); });
                return [2 /*return*/, res.json(post)];
        }
    });
}); });
exports.vote = vote;
//# sourceMappingURL=vote.js.map