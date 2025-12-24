import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();

  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should login admin successfully", async () => {
    const password = await bcrypt.hash("123456", 10);

    await User.create({
      email: "admin@test.com",

      password,

      role: "ADMIN",
    });

    const res = await request(app)
      .post("/auth/login")

      .send({
        email: "admin@test.com",

        password: "123456",
      });

    expect(res.status).toBe(200);

    expect(res.body.token).toBeDefined();
  });

  it("should reject invalid login", async () => {
    const res = await request(app)
      .post("/auth/login")

      .send({
        email: "wrong@test.com",

        password: "wrong",
      });

    expect(res.status).toBe(401);
  });
});
