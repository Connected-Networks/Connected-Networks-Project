const express = require("express");
const path = require("path");
import { app } from "./app";

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
