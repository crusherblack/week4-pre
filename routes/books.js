const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");
const { User, Testing } = require("../lib/user");

router.get("/", (req, res) => {
  const user = new User();
  console.log(user.printHelloWorld());

  const testing = new Testing();
  console.log(testing.printTesting());

  dbConn.query(
    "SELECT books.id, books.name ,books.author, category.name as category FROM books LEFT JOIN category ON books.categoryId = category.id ORDER BY created_at DESC",
    (error, rows) => {
      if (error) {
        req.flash("error", error);
        res.render("books/index", { data: [] });
      } else {
        console.log(rows);
        res.render("books/index", {
          data: rows,
          title: "Ini adalah buku",
        });
      }
    }
  );
});

router.get("/add", (req, res) => {
  res.render("books/add", {
    name: "",
    author: "",
  });
});

router.post("/add", (req, res) => {
  const { name, author } = req.body;
  let errors = false;
  let errorMessage;

  //validasi
  if (name.length === 0 || author.length === 0) {
    errors = true;
    if (name.length === 0) {
      errorMessage = "Please enter name";
    } else if (author.length === 0) {
      errorMessage = "Please enter author";
    }

    req.flash("error", errorMessage);
    res.render("books/add", {
      name,
      author,
    });
  }

  if (!errors) {
    const formData = {
      name,
      author,
    };

    dbConn.query("INSERT INTO books SET ?", formData, (err, result) => {
      if (err) {
        req.flash("error", err);

        res.render("books/add", {
          name,
          author,
        });
      } else {
        req.flash("success", "Book successfully added");
        res.redirect("/books");
      }
    });
  }
});

router.get("/edit/(:id)", (req, res) => {
  const { id } = req.params;

  dbConn.query("SELECT * FROM books WHERE id =" + id, (err, rows) => {
    if (err) throw err;

    if (rows.length <= 0) {
      req.flash("error", "Book Not Found");
      res.redirect("/books");
    } else {
      res.render("books/edit", {
        id: rows[0].id,
        name: rows[0].name,
        author: rows[0].author,
      });
    }
  });
});

router.post("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, author } = req.body;
  let errors = false;

  if (name.length === 0 || author.length === 0) {
    errors = true;
    if (name.length === 0) {
      errorMessage = "Please enter name";
    } else if (author.length === 0) {
      errorMessage = "Please enter author";
    }

    req.flash("error", errorMessage);
    res.render("books/edit", {
      id,
      name,
      author,
    });
  }

  if (!errors) {
    const formData = {
      name,
      author,
    };

    dbConn.query(
      "UPDATE books SET ? WHERE id =" + id,
      formData,
      (err, result) => {
        if (err) {
          req.flash("error", err);
          res.render("books/edit", {
            id,
            name,
            author,
          });
        } else {
          req.flash("success", "Book successfully updated");
          res.redirect("/books");
        }
      }
    );
  }
});

router.get("/delete/(:id)", (req, res) => {
  const { id } = req.params;

  dbConn.query("DELETE FROM books WHERE id =" + id, (err, result) => {
    if (err) {
      req.flash("error", err);
    } else {
      req.flash("success", "Book Succesfully Deleted");
    }
    res.redirect("/books");
  });
});

module.exports = router;
