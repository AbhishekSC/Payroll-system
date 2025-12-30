import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware.js";
import PayrollRoutes from "./routes/payroll.route.js";
import WalletRoutes from "./routes/wallet.route.js";
import AuthRoutes from "./routes/auth.route.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/payroll", PayrollRoutes);
app.use("/api/wallet", WalletRoutes);

app.use(errorHandler);

export default app;
