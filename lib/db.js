const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "crud-pre2",
});

connection.connect((error) => {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Database Connected...");
  }
});

module.exports = connection;
