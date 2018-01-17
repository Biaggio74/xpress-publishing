const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

const artistRouter = express.Router();
app.use('/api', artistRouter);

app.listen(PORT, () => {
  console.log('Server listen on port 4000');
});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistRouter.get('/artists', (req, res, next) => {
  db.all('SELECT * FROM Artist', (err,rows) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send({'artists' : rows});
    };
  });
});

artistRouter.post('/artists', (req, res, next) => {
  db.run('INSERT INTO Artist (id, name, date_of_birth, biography, is_currently_employed) VALUES ($id, $name, $date_of_birth, $biography, $is_currently_employed)', {
    $name: req.body.artist.name,
    $date_of_birth: req.body.artist.dateOfBirth,
    $biography: req.body.artist.biography,
    $is_currently_employed: 1
  }, function(err){
    if (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
    const id = this.lastID;
    db.get('SELECT * FROM Artist WHERE id = $id',
    {
        $id: id
    },
     (err, row) => {
      if (err){
        res.status(500).send('Internal server error')
      }
      res.status(201).send(row);
    })
  });
});

module.exports = app;
