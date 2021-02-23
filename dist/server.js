"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const colors_1 = __importDefault(require("colors"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
    .then((con) => {
    console.log(colors_1.default.yellow.bold(`Database connected ${con.connection.host}`));
})
    .catch((err) => {
    console.error(err.message.red.underline.bold);
    process.exit(1);
});
// Listening code
const port = process.env.PORT || 5000;
app_1.default.listen(port, () => {
    console.log(colors_1.default.yellow.bold(`Server running in ${process.env.NODE_ENV} on port ${port}`));
});
//# sourceMappingURL=server.js.map