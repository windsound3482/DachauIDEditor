const express = require('express')
const app = express()
const sqlite3 = require("sqlite3").verbose();
const filepath = "./dachau.db";
const port=80
const db= new sqlite3.Database(filepath, (error) => {
  if (error) {
    return console.error(error.message);
  }
});


function addPerson(name) {
  db.run(`
  INSERT INTO objects (type, data)
  VALUES (?, ?)`,
  ['Person',name],
  function (error) {
    if (error) {
      console.error(error.message);
    }
    console.log(`Inserted a row with the ID: ${this.lastID}`);
  }
  );
}

function selectRows(res) {
  db.each(`SELECT * FROM objects`, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    res.send(row);
  });
}


app.get('/', function (req, res) {
  addPerson("Albert Einstein");
  selectRows(res);
});

app.listen(port, "10.10.10.110", () => {
  console.log(`Example app listening on port ${port}`);
});