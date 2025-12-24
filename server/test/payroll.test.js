import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Payroll from "../models/Payroll.model.js";
import bcrypt from "bcrypt";

let adminToken;

let employeeToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Create ADMIN

  const admin = await User.create({
    email: "admin@test.com",

    password: await bcrypt.hash("123456", 10),

    role: "ADMIN",
  });

  // Create EMPLOYEE
  const employee = await User.create({
    email: "emp@test.com",

    password: await bcrypt.hash("123456", 10),

    role: "EMPLOYEE",

    employeeId: "EMP004",
  });

  adminToken = jwt.sign(
    { id: admin._id, role: "ADMIN" },

    process.env.JWT_SECRET
  );

  employeeToken = jwt.sign(
    {
      id: employee._id,

      role: "EMPLOYEE",

      employeeId: "EMP004",
    },

    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();

  await mongoose.connection.close();
});

describe("Payroll API", () => {
  let payrollId;

  it("ADMIN can create payroll (EMP003)", async () => {
    const res = await request(app)
      .post("/api/payroll")

      .set("Authorization", `Bearer ${adminToken}`)

      .send({
        employee_id: "EMP003",

        name: "Honey sharma",

        department: "HR",

        salary: 60000,

        bonus: 6000,

        deductions: 2000,
      });

    expect(res.status).toBe(201);

    expect(res.body.employee_id).toBe("EMP003");
  });

  it("ADMIN can create payroll (EMP004)", async () => {
    const res = await request(app)
      .post("/api/payroll")

      .set("Authorization", `Bearer ${adminToken}`)

      .send({
        employee_id: "EMP004",

        name: "Aditya sharma",

        department: "Engineering",

        salary: 90000,

        bonus: 10000,

        deductions: 4000,
      });

    expect(res.status).toBe(201);

    payrollId = res.body._id;
  });

  it("ADMIN can list all payrolls", async () => {
    const res = await request(app)
      .get("/api/payroll")

      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it("EMPLOYEE can fetch only own payroll", async () => {
    const res = await request(app)
      .get("/api/payroll/me")

      .set("Authorization", `Bearer ${employeeToken}`);

    expect(res.status).toBe(200);

    expect(res.body.employee_id).toBe("EMP004");
  });

  it("EMPLOYEE cannot access payroll list", async () => {
    const res = await request(app)
      .get("/api/payroll")

      .set("Authorization", `Bearer ${employeeToken}`);

    expect(res.status).toBe(403);
  });

  it("ADMIN can fetch net pay for payroll", async () => {
    const res = await request(app)
      .get(`/api/payroll/${payrollId}/net-pay`)

      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    expect(res.body.net).toBeDefined();
  });

  it("ADMIN can fetch payroll anomalies", async () => {
    const res = await request(app)
      .get(`/api/payroll/${payrollId}/anomalies`)

      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    expect(res.body.issues).toBeDefined();
  });
});
