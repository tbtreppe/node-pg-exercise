/** Tests for invoices. */

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

// before each test, clean out data
beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /", () => {
  test("Get all invoices", async () => {
    const res = await request(app).get("/invoices");
    expect(res.body).toEqual({
      invoices: [
        { id: 1, comp_code: "apple" },
        { id: 2, comp_code: "apple" },
        { id: 3, comp_code: "ibm" },
      ],
    });
  });
});

describe("GET /1", () => {
  test("Get info on invoice", async () => {
    const res = await request(app).get("/invoices/1");
    expect(res.body).toEqual({
      invoice: {
        id: 1,
        amt: 100,
        add_date: "2018-01-01",
        paid: false,
        paid_date: null,

        company: {
          code: "apple",
          name: "Apple",
          description: "Maker of OSX",
        },
      },
    });
  });
  test("Get 404 if invoice not found", async () => {
    const res = await request(app).get("/invoices/89");
    expect(res.status).toEqual(404);
  });
});

describe("POST /", () => {
  test("Add invoice", async () => {
    const res = await request(app)
      .post("/invoices")
      .send({ amt: 400, comp_code: "ibm" });
    expect(res.status).toEqual(201);
    expect(res.body).toEqual({
      invoice: {
        id: 4,
        comp_code: "ibm",
        amt: 400,
        add_date: expect.any(String),
        paid: false,
        paid_date: null,
      },
    });
  });
});

describe("PUT /", () => {
  test("Update invoice", async () => {
    const res = await (
      await request(app).put("/invoices/1")
    ).send({ amt: 1000 });
    expect(res.body).toEqual({
      company: {
        code: "apple",
        name: "Apple",
        description: "Maker of all things i",
      },
    });
    expect(res.body).toEqual({
      invoice: {
        id: 1,
        comp_code: "apple",
        amt: 1000,
        add_date: expect.any(String),
        paid: false,
        paid_date: null,
      },
    });
  });
  test("Return 404 for no invoice", async () => {
    const res = await (
      await request(app).put("/companies/999")
    ).send({ amt: 10000 });
    expect(res.status).toEqual(404);
  });
});

describe("DELETE /", () => {
  test("Delete invoice", async () => {
    const res = await await request(app).delete("/invoices/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: "DELETED!" });
  });
});
