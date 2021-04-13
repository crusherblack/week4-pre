const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

router.get("/", (request, response, next) => {
  dbConn.query(
    "SELECT * FROM books ORDER BY created_at DESC",
    (error, rows) => {
      if (error) {
        request.flash("error", error);
        response.render("books", { data: [] });
      } else {
        response.render("books", {
          data: rows,
          title: "Ini adalah buku",
        });
      }
    }
  );
});

module.exports = router;
