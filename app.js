
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const ExpressError = require("./utils/ExpressError.js");

// DATABASE CONFIGURATION

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
    throw new Error("ATLASDB_URL is missing!");
}

if (!process.env.SECRET) {
    throw new Error("SECRET is missing!");
}

// VIEW ENGINE CONFIGURATION

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

// MIDDLEWARE CONFIGURATION

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

// SESSION CONFIGURATION

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
};

app.use(session(sessionOptions));

// FLASH MIDDLEWARE

app.use(flash());

// PASSPORT CONFIGURATION

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL LOCALS MIDDLEWARE

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next();
});

// ROUTES

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// HOME ROUTE

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// 404 ERROR HANDLER

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = "Something went wrong!"
    } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// DATABASE CONNECTION AND SERVER START

const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        await mongoose.connect(dbUrl);

        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("SERVER START ERROR:", err);
        process.exit(1);
    }
}

startServer();
