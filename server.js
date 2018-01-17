const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server listen on port 4000');
});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

app.get('/api/artists', (req, res, next) => {
  db.all('SELECT * FROM Artist', (err,rows) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send({'artists' : rows});
    };
  })
})

app.post('/api/artists', (req, res, next) => {
  db.run('INSERT INTO Artist (id, name, date_of_birth, biography, is_currently_employed) VALUES ($id, $name, $date_of_birth, $biography, $is_currently_employed)',
  {
    $name: req.body.artist.name,
    $date_of_birth: req.body.artist.dateOfBirth,
    $biography: req.body.artist.biography
  },
  (err,row) => {
    if (err) {
      console.log(err.message);
    } else {
      res.status(201).send({artist : row});
    }
  })
})

module.exports = app;
