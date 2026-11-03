const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 3600,
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { expires: Date.now() + 7 * 24 * 60 * 60 * 1000, maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }
};