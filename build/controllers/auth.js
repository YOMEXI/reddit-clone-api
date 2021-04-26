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
exports.UserOwnSub = exports.OnlyUser = exports.logout = exports.authorize = exports.userDetails = exports.login = exports.register = void 0;
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var class_validator_1 = require("class-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var cookie_1 = __importDefault(require("cookie"));
var User_1 = require("./../entities/User");
var trimedError_1 = require("../middleware/trimedError");
var Sub_1 = require("../entities/Sub");
var register = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, username, password, age, emailExist, userExist, user, errors;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, username = _a.username, password = _a.password, age = _a.age;
                return [4 /*yield*/, User_1.User.findOne({ email: email })];
            case 1:
                emailExist = _b.sent();
                return [4 /*yield*/, User_1.User.findOne({ username: username })];
            case 2:
                userExist = _b.sent();
                if (emailExist) {
                    res.status(404);
                    throw new Error("Email already exist");
                }
                if (userExist) {
                    res.status(404);
                    throw new Error("Username already exist");
                }
                user = new User_1.User({ email: email, username: username, password: password, age: age });
                return [4 /*yield*/, class_validator_1.validate(user)];
            case 3:
                errors = _b.sent();
                if (errors.length > 0) {
                    return [2 /*return*/, res.status(400).json(trimedError_1.mapError(errors))];
                }
                return [4 /*yield*/, user.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Registration Successful",
                        user: user,
                    })];
        }
    });
}); });
exports.register = register;
//
var login = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, errors, user, checkPassword, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                errors = {};
                if (class_validator_1.isEmpty(username))
                    errors.username = "Username should not be empty";
                if (class_validator_1.isEmpty(password))
                    errors.password = "Password should not be empty";
                if (Object.keys(errors).length > 0) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                return [4 /*yield*/, User_1.User.findOne({ username: username })];
            case 1:
                user = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                checkPassword = _b.sent();
                if (!user) {
                    res.status(404);
                    throw new Error("User Doesn't Exist ");
                }
                if (!checkPassword) {
                    res.status(404);
                    throw new Error("Incorrect password");
                }
                token = jsonwebtoken_1.default.sign({ username: username }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY,
                });
                res.set("Set-Cookie", cookie_1.default.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 360000,
                    path: "/",
                }));
                res.status(200).json({
                    message: "login successfull",
                    user: user,
                });
                return [2 /*return*/];
        }
    });
}); });
exports.login = login;
var authorize = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, username, stillTheUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.headers.cookie) {
                    token = req.headers.cookie.split("=")[1];
                }
                if (!token) {
                    res.status(401);
                    throw new Error("Please Log In");
                }
                username = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET).username;
                return [4 /*yield*/, User_1.User.findOne({ username: username })];
            case 1:
                stillTheUser = _a.sent();
                if (!stillTheUser) {
                    res.status(401);
                    throw new Error("User No Longer Exist");
                }
                req.user = stillTheUser;
                next();
                return [2 /*return*/];
        }
    });
}); });
exports.authorize = authorize;
var OnlyUser = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, username, stillTheUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.headers.cookie) {
                    return [2 /*return*/, next()];
                }
                if (req.headers.cookie) {
                    token = req.headers.cookie.split("=")[1];
                }
                username = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET).username;
                return [4 /*yield*/, User_1.User.findOne({ username: username })];
            case 1:
                stillTheUser = _a.sent();
                req.user = stillTheUser;
                next();
                return [2 /*return*/];
        }
    });
}); });
exports.OnlyUser = OnlyUser;
var UserOwnSub = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, sub;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                return [4 /*yield*/, Sub_1.Sub.findOneOrFail({ where: { name: req.params.name } })];
            case 1:
                sub = _a.sent();
                if (sub.username !== user.username) {
                    res.status(401);
                    throw new Error("Sub is not yours");
                }
                next();
                return [2 /*return*/];
        }
    });
}); });
exports.UserOwnSub = UserOwnSub;
var userDetails = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.user.username;
                return [4 /*yield*/, User_1.User.findOne({ username: username })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(401);
                    throw new Error("User doesn't exist");
                }
                res.json(user);
                return [2 /*return*/];
        }
    });
}); });
exports.userDetails = userDetails;
var logout = express_async_handler_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.set("Set-Cookie", cookie_1.default.serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        }));
        res.status(200).json({ success: true });
        return [2 /*return*/];
    });
}); });
exports.logout = logout;
//# sourceMappingURL=auth.js.map