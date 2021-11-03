"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const session = require("express-session");
// initialization
const app = (0, express_1.default)();
app.use(express_1.default.static(__dirname + "/build"));
app.use(session({
    secret: "something crazy",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
//settings
app.set("port", 5000);
//middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//routes
app.use("/", routes_1.default);
// static files
// starting the server
app.listen(app.get("port"), () => {
    console.log("server on 5000");
});
//# sourceMappingURL=index.js.map