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
exports.Search = exports.popularSub = exports.SubImage = exports.oneSub = exports.createSub = void 0;
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var class_validator_1 = require("class-validator");
var typeorm_1 = require("typeorm");
var formidable_1 = __importDefault(require("formidable"));
var cloudinary_1 = require("cloudinary");
var cloudinary = cloudinary_1.v2;
var Sub_1 = require("../entities/Sub");
var Post_1 = require("../entities/Post");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
//
var createSub = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, title, description, user, errors, sub, newSub;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, title = _a.title, description = _a.description;
                user = req.user;
                user.password = false;
                errors = {};
                if (class_validator_1.isEmpty(title))
                    errors.title = "title should not be empty";
                if (class_validator_1.isEmpty(name))
                    errors.name = "name should not be empty";
                return [4 /*yield*/, typeorm_1.getRepository(Sub_1.Sub)
                        .createQueryBuilder("sub")
                        .where("lower(sub.name) = :name", { name: name.toLowerCase() })
                        .getOne()];
            case 1:
                sub = _b.sent();
                if (sub)
                    errors.name = "Sub already exists";
                if (Object.keys(errors).length > 0) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                newSub = new Sub_1.Sub({ name: name, title: title, description: description, user: user });
                if (!newSub) {
                    res.status(400);
                    throw new Error("Sub creation error");
                }
                return [4 /*yield*/, newSub.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Sub Created" })];
        }
    });
}); });
exports.createSub = createSub;
var oneSub = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name, sub, posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params.name;
                return [4 /*yield*/, Sub_1.Sub.findOneOrFail({ name: name })];
            case 1:
                sub = _a.sent();
                return [4 /*yield*/, Post_1.Post.find({
                        where: { sub: sub },
                        order: { createdAt: "DESC" },
                        relations: ["comments", "votes"],
                    })];
            case 2:
                posts = _a.sent();
                sub.posts = posts;
                if (req.user) {
                    posts.forEach(function (p) { return p.setUserVote(req.user); });
                }
                res.status(200).json(sub);
                return [2 /*return*/];
        }
    });
}); });
exports.oneSub = oneSub;
var SubImage = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var form, name;
    return __generator(this, function (_a) {
        form = formidable_1.default({ multiples: true });
        name = req.params.name;
        form.parse(req, function (err, fields, files) { return __awaiter(void 0, void 0, void 0, function () {
            var image, sub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            res.status(404);
                            throw new Error("File  Upload error");
                        }
                        image = files.image;
                        return [4 /*yield*/, Sub_1.Sub.findOneOrFail({ name: name })];
                    case 1:
                        sub = _a.sent();
                        if (image === "" || !image) {
                            res.status(404);
                            throw new Error("Image  Upload error");
                        }
                        if (sub && image) {
                            cloudinary.uploader.upload(image.path, {
                                resource_type: "auto",
                                public_id: "my_folder/" + image.path,
                                overwrite: true,
                            }, function (error, result) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                (sub.imageUrl = result.url), (sub.imageUrl_Id = result.public_id);
                                                return [4 /*yield*/, sub.save()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, res.status(200).json("Image Uploaded")];
                                        }
                                    });
                                });
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
exports.SubImage = SubImage;
var popularSub = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var sub;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getConnection()
                    .createQueryBuilder()
                    .select("sub.title,sub.name,sub.\"imageUrl\",count(post.id) as \"postCount\"")
                    .from(Sub_1.Sub, "sub")
                    .leftJoin(Post_1.Post, "post", "sub.name=post.\"subName\"")
                    .groupBy("sub.title,sub.name,sub.\"imageUrl\"")
                    .orderBy("\"postCount\"", "DESC")
                    .limit(4)
                    .execute()];
            case 1:
                sub = _a.sent();
                res.status(200).json(sub);
                return [2 /*return*/];
        }
    });
}); });
exports.popularSub = popularSub;
var Search = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name, subs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params.name;
                return [4 /*yield*/, typeorm_1.getRepository(Sub_1.Sub)
                        .createQueryBuilder()
                        .where("LOWER(name) LIKE :name", {
                        name: "%" + name.toLowerCase().trim() + "%",
                    })
                        .getMany()];
            case 1:
                subs = _a.sent();
                res.status(200).json(subs);
                return [2 /*return*/];
        }
    });
}); });
exports.Search = Search;
//# sourceMappingURL=sub.js.map