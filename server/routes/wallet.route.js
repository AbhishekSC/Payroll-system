import express from "express";
import {
  creditSalary,
  getMyWallet,
  getMyTransactions,
  getWalletAnomalies,
  getWalletTransactionsByEmployee,
} from "../controllers/wallet.controller.js";

import authenticateUser from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

// Payroll / Admin
router.post("/credit", authenticateUser, roleMiddleware("ADMIN"), creditSalary);

// Employee
router.get("/me", authenticateUser, roleMiddleware("EMPLOYEE"), getMyWallet);
router.get(
  "/me/transactions",
  authenticateUser,
  roleMiddleware("EMPLOYEE"),
  getMyTransactions
);

router.get(
  "/:employeeId/anomalies",
  authenticateUser,
  roleMiddleware("ADMIN"),
  getWalletAnomalies
);

router.get(
  "/:employeeId/transactions",
  authenticateUser,
  roleMiddleware("ADMIN"),
  getWalletTransactionsByEmployee
);

export default router;
