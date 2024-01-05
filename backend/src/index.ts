import express from "express";
import bodyParser from "body-parser";

import postExec from "./endpoints/post/postExec";

var cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

postExec(app);

const port = 8181;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
