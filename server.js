const express = require('express');
const bodyParser = require('body-parser');

const checkInternetConnected = require('check-internet-connected');
const spawn = require("child_process").spawn;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test/connectivity', (req, res) => {
  checkInternetConnected({ domain: 'https://www.google.com' }) //https://videk.ijs.si
    .then((result) => {
      res.send({ successful: true, message: "" }); // Successfully connected to a server.
    })
    .catch((ex) => {
      res.send({ successful: false, message: `No connectivity (${ex.errno})`}); // Cannot connect to a server or error occurred.
    });
  
});

app.get('/test/rpi', (req, res) => {
  res.send(getRandomResponse());
});

app.get('/test/pmc', (req, res) => {
  const pythonProcess = spawn('python3',["scripts/check-wiring.py"]);
  pythonProcess.stdout.on('data', (data) => {
    res.send(data);
  });
});

app.get('/test/uwb', (req, res) => {
  res.send(getRandomResponse());
});

app.get('/test/microhub', (req, res) => {
  res.send(getRandomResponse());
});

const getRandomResponse = () => {
  if(Math.random() < 0.5) {
    return { successful: true, message: "" };
  }
  else {
    return { successful: false, message: "This is a random error" };
  }
}


app.listen(port, () => console.log(`Listening on port ${port}`));