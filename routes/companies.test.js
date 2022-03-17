/** Tests for companies. */

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");
const { test } = require("media-typer");

// before each test, clean out data
beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /", () => {
  test("Get all companies", async () => {
    const res = await request(app).get("/companies");
    expect(res.body).toEqual({
      companies: [
        { code: "apple", name: "Apple" },
        { code: "ibm", name: "IBM" },
      ],
    });
  });
});

describe("GET /ibm", () => {
  test("Get info on company", async () => {
    const res = await request(app).get("/companies/ibm");
    expect(res.body).toEqual({
      company: {
        code: "ibm",
        name: "IBM",
        description: "Big blue.",
        invoices: [3],
      },
    });
  });
  test("Get 404 if company not found", async () => {
    const res = await request(app).get("/companies/blah");
    expect(res.status).toEqual(404);
  });
});

describe("POST /", () => {
  test("Add company", async () => {
    const res = await request(app)
      .post("/companies")
      .send({ code: "twitter", name: "Twitter", description: "messsage site" });
    expect(res.status).toEqual(201);
    expect(res.body).toEqual({
      company: {
        code: "twitter",
        name: "Twitter",
        description: "messsage site",
      },
    });
  });
  test("Return 500 for issue", async () => {
    const res = await request(app).post("/companies").send({
      code: "ibm",
      name: "IBM",
      description: "Big buggggg.",
    });
    expect(res.status).toEqual(500);
  });
});

describe("PUT /", () => {
  test("Update company", async () => {
    const res = await (
      await request(app).put("/companies/apple")
    ).send({ description: "Maker of all things i" });
    expect(res.body).toEqual({
      company: {
        code: "apple",
        name: "Apple",
        description: "Maker of all things i",
      },
    });
  });
  test("Return 404 for no company", async () => {
    const res = await (
      await request(app).put("/companies/blah")
    ).send({ name: "blah" });
    expect(res.status).toEqual(404);
  });
});

describe("DELETE /", () => {
  test("Delete company", async () => {
    const res = await await request(app).delete("/companies/ibm");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: "DELETED!" });
  });
});
