import request from "supertest";
import { app } from "../src/app";

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "test_pass_99",
      email: "test_pass_99@gmail.com",
      password: "test_pass_99",
    })
    .expect(201);
});

test("Shouldn't signup a new user: invalid password", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "test_password",
      email: "test_password@gmail.com",
      password: "test_password",
    })
    .expect(400);
});
