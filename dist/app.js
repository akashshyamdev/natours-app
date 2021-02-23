"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Initiating the app
const app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use('/api/v1/tours', tourRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.get('/', () => {
    //
});
exports.default = app;
//# sourceMappingURL=app.js.map