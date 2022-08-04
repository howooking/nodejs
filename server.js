// if (process.env.NODE_ENV !== "production") {
//   //"배포"환경이 아니라 개발환경이라면
//   require("dotenv").config(); //환경변수들을 가져와라
// } //배포 환경에서는 다른 방식으로 환경변수들을 관리함
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const campgroundRoute = require("./routes/campgrounds");
const reviewRoute = require("./routes/reviews");
const userRoute = require("./routes/users");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// const sessionOptions = {
//   secret: "secret",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//     httpOnly: true,
//   },
// };
// app.use(session(sessionOptions));

const secret = process.env.SECRET || "howooking";

app.use(
  session({
    secret: secret,
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: dbUrl,
      touchAfter: 24 * 3600, // time period in seconds
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelpCamp";
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("mongo connection open");
  })
  .catch((err) => {
    console.log("mongo error happened");
    console.log(err);
  });

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/fakeuser", async (req, res) => {
  const user = new User({ email: "colt@gma1il.com", username: "col1ty" });
  const newUser = await User.register(user, "password");
  res.send(newUser);
});

app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  if (!err.message) {
    err.message = "oh no!! something went wrong";
  }
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
