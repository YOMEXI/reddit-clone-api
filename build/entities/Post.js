"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
var typeorm_1 = require("typeorm");
var SimilarEntity_1 = __importDefault(require("./SimilarEntity"));
var User_1 = require("./User");
var utils_1 = require("../helpers/utils");
var Sub_1 = require("./Sub");
var Comment_1 = require("./Comment");
var class_transformer_1 = require("class-transformer");
var Vote_1 = require("./Vote");
var Post = /** @class */ (function (_super) {
    __extends(Post, _super);
    function Post(post) {
        var _this = _super.call(this) || this;
        Object.assign(_this, post);
        return _this;
    }
    Post.prototype.IdAndSlug = function () {
        this.identifier = utils_1.makeId(7);
        this.slug = utils_1.slugify(this.title);
    };
    Object.defineProperty(Post.prototype, "url", {
        get: function () {
            return "/r/" + this.subName + "/" + this.identifier + "/" + this.slug;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "commentCount", {
        get: function () {
            var _a;
            return (_a = this.comments) === null || _a === void 0 ? void 0 : _a.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "voteScore", {
        get: function () {
            var _a;
            return (_a = this.votes) === null || _a === void 0 ? void 0 : _a.reduce(function (prev, curr) { return prev + (curr.value || 0); }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Post.prototype.setUserVote = function (user) {
        var _a;
        var index = (_a = this.votes) === null || _a === void 0 ? void 0 : _a.findIndex(function (v) { return v.username === user.username; });
        this.userVote = index > -1 ? this.votes[index].value : 0;
    };
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Post.prototype, "identifier", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Post.prototype, "title", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Post.prototype, "slug", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Post.prototype, "username", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true, type: "text" }),
        __metadata("design:type", String)
    ], Post.prototype, "body", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Post.prototype, "subName", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return User_1.User; }, function (user) { return user.posts; }),
        typeorm_1.JoinColumn({ name: "username", referencedColumnName: "username" }),
        __metadata("design:type", User_1.User)
    ], Post.prototype, "user", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Sub_1.Sub; }, function (sub) { return sub.posts; }),
        typeorm_1.JoinColumn({ name: "subName", referencedColumnName: "name" }),
        __metadata("design:type", Sub_1.Sub)
    ], Post.prototype, "sub", void 0);
    __decorate([
        class_transformer_1.Exclude(),
        typeorm_1.OneToMany(function () { return Vote_1.Vote; }, function (vote) { return vote.post; }),
        __metadata("design:type", Array)
    ], Post.prototype, "votes", void 0);
    __decorate([
        class_transformer_1.Exclude(),
        typeorm_1.OneToMany(function () { return Comment_1.Comment; }, function (comment) { return comment.post; }),
        __metadata("design:type", Array)
    ], Post.prototype, "comments", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Post.prototype, "IdAndSlug", null);
    __decorate([
        class_transformer_1.Expose(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], Post.prototype, "url", null);
    __decorate([
        class_transformer_1.Expose(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [])
    ], Post.prototype, "commentCount", null);
    __decorate([
        class_transformer_1.Expose(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [])
    ], Post.prototype, "voteScore", null);
    Post = __decorate([
        typeorm_1.Entity("posts"),
        __metadata("design:paramtypes", [Object])
    ], Post);
    return Post;
}(SimilarEntity_1.default));
exports.Post = Post;
//# sourceMappingURL=Post.js.map