require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { DATABASE_HOST } = require('./config/vars');

// Imports routes
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');

const app = express();
// DB connection
mongoose
    .connect(DATABASE_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(() => console.log("DB connected."));

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// routes
app.use('/api', authRoute);
app.use('/api', userRoute);

// port
const port = 8000;

// server starting
app.listen(port, () => console.log(`server is running at ${port}`));