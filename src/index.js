const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();

const bni = require("./routes/bni");

app.use(express.json());
app.use(cors());

app.use("/api/bni",bni);

app.all("*", (_,res)=>{
  res.send({res:"Oppss yout wrong endpoint!"});
});

const server = http.createServer(app);
server.listen(4000);