const backendProcessing = require("./backend-processing.ts");

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/csv", (req, res) => {
  const data = req;
  console.log(req.body);
  try {
    let be = new backendProcessing();
    be.processRawCSV(data);
    res.sendStatus(200);
  } catch (error) {
    console.log("error");
    res.sendStatus(500);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
