"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var morgan_1 = __importDefault(require("morgan"));
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var authRoute_1 = __importDefault(require("./routes/authRoute"));
var postRoute_1 = __importDefault(require("./routes/postRoute"));
var subRoute_1 = __importDefault(require("./routes/subRoute"));
var miscRoute_1 = __importDefault(require("./routes/miscRoute"));
var commentRoute_1 = __importDefault(require("./routes/commentRoute"));
var errorHandler_1 = require("./middleware/errorHandler");
//
var trim_1 = __importDefault(require("./middleware/trim"));
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
}));
app.use(morgan_1.default("dev"));
app.use(trim_1.default);
app.use(cookie_parser_1.default());
//routes
app.use("/api/auth", authRoute_1.default);
app.use("/api/post", postRoute_1.default);
app.use("/api/sub", subRoute_1.default);
app.use("/api/misc", miscRoute_1.default);
app.use("/api/comment", commentRoute_1.default);
app.use("*", function (req, res, next) {
    res.status(404);
    throw new Error("The url " + req.originalUrl + " doesnt exist");
    next();
});
app.use(errorHandler_1.errorhandler);
exports.default = app;
//# sourceMappingURL=app.js.map