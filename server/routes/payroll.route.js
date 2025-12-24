// import express from "express";
// import { create, getById } from "../controllers/payroll.controller.js";
// import roleMiddleware from "../middlewares/role.middleware.js";
// import authenticateUserenticateUser from "../middlewares/authenticateUser.middleware.js";

// const router = express.Router();

// router.post("/", authenticateUserenticateUser, roleMiddleware("ADMIN"), create);
// router.get("/:id", authenticateUserenticateUser, roleMiddleware("ADMIN", "EMPLOYEE"), getById);

import express from "express";
import {
  createPayroll,
  listPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
  getMyPayroll,
  getNetPay,
  getAnomalies,
} from "../controllers/payroll.controller.js";

import authenticateUser from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, roleMiddleware("ADMIN"), createPayroll);
router.get("/", authenticateUser, roleMiddleware("ADMIN"), listPayrolls);
router.get("/me", authenticateUser, roleMiddleware("EMPLOYEE"), getMyPayroll);
router.get("/:id", authenticateUser, roleMiddleware("ADMIN"), getPayrollById);
router.put("/:id", authenticateUser, roleMiddleware("ADMIN"), updatePayroll);
router.delete("/:id", authenticateUser, roleMiddleware("ADMIN"), deletePayroll);
router.get(
  "/:id/net-pay",
  authenticateUser,
  roleMiddleware("ADMIN"),
  getNetPay
);
router.get(
  "/:id/anomalies",
  authenticateUser,
  roleMiddleware("ADMIN"),
  getAnomalies
);

export default router;
