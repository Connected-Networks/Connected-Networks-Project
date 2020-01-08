const express = require("express");
const path = require("path");
const papa = require("papaparse");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/csv", (req, res) => {
  try {
    processRawCSV(req.body.data);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

function processRawCSV(data: string) {
  //First line is commented and ignored
  //Second line is treated as header
  var results = papa.parse("#" + data, { header: true, comments: "#" });
  results.data.forEach(element => {
    createCallForCSV(element);
  });
}

function createCallForCSV(entry) {
  let name = entry.Name;
  let position = entry.Position;
  let employer = entry["Current Employer"];
  let term = entry["Employment Term"];
  let call = `Received ${name} at ${employer} doing ${position} during ${term}`;
  console.log(call);
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
