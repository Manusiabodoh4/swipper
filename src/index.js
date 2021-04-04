const express = require('express');
const http = require('http');
const cors = require('cors');

const env = require('./env');

const app = express();

const bni = require("./routes/bni");
const bri = require("./routes/bri");
const mandiri = require("./routes/mandiri");
const permata = require("./routes/permata");

app.use(express.json());
app.use(cors());

app.use("/api/bni",bni);
app.use("/api/bri",bri);
app.use("/api/mandiri",mandiri);
app.use("/api/permata",permata);

app.all("*", (_,res)=>{
  res.send({res:"Oppss yout wrong endpoint!"});
});

const server = http.createServer(app);
server.listen(env.PORT);