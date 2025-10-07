require('dotenv').config();
//console.log("MONGO_URI from .env:", process.env.MONGO_URI);
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const allowedOrigins = [
  process.env.CLIENT_URL, // your main production domain from .env
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      // Allow requests with no origin (Postman, mobile, etc.)
      return callback(null, true);
    }

    // Allow specific frontend domain from .env
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel subdomains (your frontend deploys)
    if (/\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Otherwise block the origin
    return callback(new Error("Not allowed by CORS: " + origin));
  },

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // include OPTIONS for preflight
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "timeout",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  credentials: true,
}));




app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/income',incomeRoutes);
app.use('/api/v1/expense',expenseRoutes);
app.use('/api/v1/dashboard',dashboardRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date(),
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);

});