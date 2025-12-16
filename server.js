import express, { json } from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import leaveRouter from "./routes/leaveRoutes.js";
import managerRouter from "./routes/managerRoutes.js";

const PORT = process.env.PORT || 5000;
const app = express();
connectDB();
app.use(json());
const allowedOrigins = [process.env.CLIENT_URL_LOCAL, process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the Employee Leave Management backend server");
});

app.use("/api/auth", authRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api/manager", managerRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
