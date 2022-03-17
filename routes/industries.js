const express = require("express");
let router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await db.query(
      `SELECT in.id, 
                  ind.ind_code, 
                  ind.name, 
                  c.comp_code FROM companies AS ind INNER JOIN companies AS c ON (ind.comp_code = c.code) WHERE id = $1`,
      [id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Invoice not found`, 404);
    }
    const data = results.rows[0];
    const industries = {
      id: data.id,
      company: {
        code: data.comp_code,
        name: data.name,
        description: data.description,
      },
      ind_code: data.ind_code,
      name: data.name,
    };

    return res.json({ industries: industries });
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let { ind_code, name } = req.body;
    const results = await db.query(
      `INSERT INTO industries (ind_code, name) VALUES ($1, $2) RETURNING id, ind_code, name`,
      [ind_code, name]
    );
    return res.json({ industries: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
