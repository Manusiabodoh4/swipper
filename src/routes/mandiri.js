const express = require('express');
const app = express.Router();

const handlerJOI = require("../rule/mandiri/handler");
const config = require("../config");
const getMutasi = require("../engine/mandiri/get_mutasi/index");

app.post("/mutation",  handlerJOI.checkingSchemaGET_MANDIRI ,async (req, res)=>{ 
  const { 
    startDate, 
    endDate,     
    account 
  } = req.body;
  const result = await getMutasi.init(startDate,endDate,account);
  res.send({res:result, rekening : config.account2[account].rekening});
});

module.exports = app;