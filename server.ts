import BackendProcessing from "./backend-processing";

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "client/build")));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.post("/csv",(req,res)=>{
  const data = req.body.data
  try {
    let be = new BackendProcessing()
    be.processRawCSV(data)
    res.sendStatus(200)
  } catch (error) {
    console.log("error")
    res.sendStatus(500)
  }
})