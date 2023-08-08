const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const passportConfig = require("./config/passport.config");
const dbConnect = require("./config/dbConnect");

const authRouter = require('./routes/auth.route')
const customerRouter = require('./routes/customer.route')
const installmentRouter = require('./routes/installment.route')
const smsRouter = require('./routes/sms.route')
const userRouter = require('./routes/user.route')

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// setup middlewares
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded());
app.set("query parser", "extended");

app.use(passport.initialize());
// app.use(passport.session());

passport.use(passportConfig.localStrategy);
passport.use(passportConfig.jwtStrategy);

app.use(express.json({ extended: false }));

// execute database connection
dbConnect();

// getting port from .env file
const PORT = process.env.PORT;

// Mount the auth router on the /auth path
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/installment", installmentRouter);
app.use("/api/v1/sms", smsRouter);
app.use("/api/v1/collector", userRouter);


app.get('/', (req, res) => {
  res.send('hello world')
})

// server listening to requests on port on env file
app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
