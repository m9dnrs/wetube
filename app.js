import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose"
import session from "express-session";
import MongoStore from "connect-mongo"
import userRouter from "./Routers/userRouter";
import videoRouter from "./Routers/videoRouter";
import globalRouter from "./Routers/globalRouter";
import routes from "./routes";
import { localsMiddleware } from "./middlewares";

import "./passport";

const app = express();

//function
const CookieStore = MongoStore(session)

//global middleware functinon
app.use(helmet());
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: true,
		saveUninitialized: false
		store: new CookieStore({ mongooseConnection: mongoose.connection})
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);
//Routers
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;