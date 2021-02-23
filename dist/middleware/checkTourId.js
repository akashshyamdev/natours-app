"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkTourId(tours) {
    return function (req, res, next, val) {
        if (val * 1 > tours.length) {
            return res.status(404).json({
                status: 'fail',
                message: 'Invalid ID',
            });
        }
        next();
    };
}
exports.default = checkTourId;
//# sourceMappingURL=checkTourId.js.map