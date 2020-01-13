#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const checkInternetConnected = require('check-internet-connected');
const spawn = require("child_process").spawn;

const { Pool } = require("pg");
const pool = new Pool(require("./pgconfig"));

const app = express();
const port = process.env.PORT || (process.env.NODE_ENV === "production" ? 80 : 5000);

const log = require('simple-node-logger').createSimpleLogger('saam.log');

process.on('error', (msg) => {
    log.error('Error event caught: ', JSON.stringify(msg));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(process.env.NODE_ENV === "production") {
  log.info("Running the production build.");
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

app.get('/test/voice', (req, res) => {
  const pythonProcess = spawn('python3',["scripts/check-voice.py"]);
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

app.post('/report/test', (req, res) => {
  log.info("Reporting test.", req.body);

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
      log.error("Postgres INSERT error:", err);
      log.error("Postgres error position:", err.position);
    }

    if (result !== undefined) {
      if (result.rowCount > 0) {
        log.info("# of records inserted:", result.rowCount);
      } else {
        log.info("No records were inserted.");
      }
    }

    res.send();
  });
});

app.get('/labeling/start', (req, res) => {
  log.info("Started recording raw pmc data.");
  const pythonProcess = spawn('python3',["scripts/start_serial_read.py"]);
  res.send();
});

app.get('/labeling/stop', (req, res) => {
  log.info("Stopped recording raw pmc data.");
  const pythonProcess = spawn('python3',["scripts/stop_serial_read.py"]);
  res.send();
});

app.post('/report/labels', (req, res) => {
  log.info("Recording labels", req.body);

  let measurements = "";
  try {
    measurements = fs.readFileSync("data.csv", { encoding: 'utf8' });
    log.info("Read the measurements file");
  }
  catch(ex) {
    log.error(ex);
  }

  log.info("Constructing query string.");
  const queryString = `INSERT INTO labels(
    locationid, phase, labels, measurements
  ) VALUES(
  '${req.body.locationId}',
  '${req.body.phase}',
  '${JSON.stringify(req.body.labels)}',
  '${measurements}'
  )`;

  log.info("Constructing output.");
  const output = `${req.body.locationId}\t${req.body.phase}\t${JSON.stringify(req.body.labels)}\n\n${measurements}`;

  log.info("Saving to a file.");
  fs.writeFile(`./data/${(new Date()).getTime()}.csv`, output, function(err) {
    if(err) {
        log.error(err);
        return;
    }

    log.info("Labels and raw pmc data saved to file!");
  }); 

  log.info("Saving to DB.");
  pool.query(queryString, (err, result) => {
    if (err !== undefined) {
      log.error("Postgres INSERT error:", err);
      log.error("Postgres error position:", err.position);
    }

    if (result !== undefined) {
      if (result.rowCount > 0) {
        log.info("# of records inserted:", result.rowCount);
      } else {
        log.info("No records were inserted.");
      }
    }

    res.send();
  });
});

app.post('/init/locationid', (req, res) => {
  log.info("Updating locationid", req.body);
  const output = req.body.locationId + "\r\n";
  const path = "/etc/lgtc/loc-id";

  fs.writeFile(path, output, function(err) {
    if(err) {
        return log.error(err);
    }

    log.info("Location ID file updated, path: " + path + ", " + output);
  }); 

  res.send();
});

app.post('/logger', (req, res) => {
  log.info("FE:", JSON.stringify(req.body));
  res.send();
});


app.listen(port, () => log.info(`Listening on port ${port}`));
