const express = require('express');
const bodyParser = require('body-parser');

const checkInternetConnected = require('check-internet-connected');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test/connectivity', (req, res) => {
  checkInternetConnected({ domain: 'https://www.google.com' }) //https://videk.ijs.si
    .then((result) => {
      res.send({ successful: true, message: result }); // Successfully connected to a server.
    })
    .catch((ex) => {
      res.send({ successful: false, message: ex }); // Cannot connect to a server or error occurred.
    });
  
});

app.get('/test/rpi', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/test/pmc', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/test/uwb', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/test/microhub', (req, res) => {
  res.send({ express: 'Hello From Express' });
});


app.listen(port, () => console.log(`Listening on port ${port}`));