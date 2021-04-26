"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapError = void 0;
var mapError = function (errors) {
    return errors.reduce(function (prev, err) {
        prev[err.property] = Object.entries(err.constraints)[0][1];
        return prev;
    }, {});
};
exports.mapError = mapError;
//# sourceMappingURL=trimedError.js.map