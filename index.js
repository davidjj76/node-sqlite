const fs = require('fs');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db.sqlite3');
const rows = [];

db.serialize(function() {
  db.run('CREATE TABLE lorem (info TEXT)');

  const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
  for (var i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i);
  }
  stmt.finalize();

  db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
    const newRow = row.id + ': ' + row.info;
    rows.push(newRow);
    console.log(newRow);
  });
});

db.close(() => {
  fs.unlink('db.sqlite3', () => console.log('Fichero borrado!'));
});

const app = express();
app.get('/', (req, res) => {
  res.send(rows);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
