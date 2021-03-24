const express = require('express');
const cors = require('cors');
const app = express();

const bni = require("./routes/bni");

app.use(express.json());
app.use(cors());

app.use("/api/bni", bni);

app.listen(4000);