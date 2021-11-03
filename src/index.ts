import express from "express";
import Routes from "./routes";
const session = require("express-session");

// initialization
const app: express.Application = express();
app.use(express.static(__dirname + "/build"));
app.use(
  session({
    secret: "something crazy",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//settings
app.set("port", 5000);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", Routes);

// static files

// starting the server
app.listen(process.env.PORT || 5000, () => {
  console.log("server on 5000");
});
