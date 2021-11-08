import express from "express";
import Routes from "./routes";
import cors from "cors";
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

const getOptionsCors = () => {
  const whitelist = [``];
  const corsOptions = {
    origin: (origin: any, callback: any) => {
      callback(null, true);
      // if (whitelist.indexOf(origin) !== -1) {
      //   callback(null, true);
      // } else {
      //   callback(new Error("Not allowed by CORS"));
      // }
    },
    credentials: true,
    exposedHeaders: ["filename"],
  };
  return corsOptions;
};
app.use(cors(getOptionsCors()));

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
