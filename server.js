const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const checkInternetConnected = require('check-internet-connected');
const spawn = require("child_process").spawn;

const { Pool } = require("pg");
const pool = new Pool(require("./pgconfig"));

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(process.env.NODE_ENV == "production") {
  console.log("Running the production build.");
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

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
  //res.send({ successful: false, message: "This test is not implemented. Please dismiss this procedure." });
  const pythonProcess = spawn('python3',["scripts/check-amb.py"]);
  const timer = setTimeout(() => {
      pythonProcess.kill(); //kill('SIGKILL')
      res.send({ successful: false, message: "Test timeout: Device turned off or Wi-Fi not connected." });
  }, 12000);

  pythonProcess.stdout.on('data', (data) => {
    clearInterval(timer);
    const decodedData = data.toString('utf8');
    if(decodedData == "OK") {
      res.send({ successful: true, message: "" });
    }
    else {
      res.send({ successful: false, message: decodedData });
    }
  });
});

app.get('/test/pmc', (req, res) => {
  const pythonProcess = spawn('python3',["scripts/check-wiring.py"]);
  const timer = setTimeout(() => {
      pythonProcess.kill(); //kill('SIGKILL')
      res.send({ successful: false, message: "Test timeout: Device turned off or Wi-Fi not connected." });
  }, 12000);

  pythonProcess.stdout.on('data', (data) => {
    clearInterval(timer);
    const decodedData = data.toString('utf8');
    if(decodedData == "OK") {
      res.send({ successful: true, message: "" });
    }
    else {
      res.send({ successful: false, message: decodedData });
    }
  });
});

app.get('/test/uwb', (req, res) => {
  const pythonProcess = spawn('python3',["scripts/check-UWB.py"]);
  const timer = setTimeout(() => {
      pythonProcess.kill(); //kill('SIGKILL')
      res.send({ successful: false, message: "Test timeout: Device turned off or Wi-Fi not connected." });
  }, 12000);

  pythonProcess.stdout.on('data', (data) => {
    clearInterval(timer);
    const decodedData = data.toString('utf8');
    if(decodedData == "OK") {
      res.send({ successful: true, message: "" });
    }
    else {
      res.send({ successful: false, message: decodedData });
    }
  });
});

app.get('/test/microhub', (req, res) => {
  res.send({ successful: false, message: "This test is not implemented. Please dismiss this procedure." });
});

app.post('/report/test', (req, res) => {
  const queryString = `INSERT INTO tests(
    locationid, phase, timestamp, testname, status, comment
  ) VALUES(
  '${req.body.locationId}',
  '${req.body.phase}',
  ${req.body.timestamp},
  '${req.body.testName}',
  '${req.body.status}',
  '${req.body.comment}'
  )`;

  pool.query(queryString, (err, result) => {
    if (err !== undefined) {
      console.log("Postgres INSERT error:", err);
      console.log("Postgres error position:", err.position);
    }

    if (result !== undefined) {
      if (result.rowCount > 0) {
        console.log("# of records inserted:", result.rowCount);
      } else {
        console.log("No records were inserted.");
      }
    }

    res.send();
  });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
