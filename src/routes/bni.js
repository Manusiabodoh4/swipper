const express = require('express');
const app = express.Router();

const handlerJOI = require("../rule/bni/handler");
const config = require("../config");
const getMutasiBNI = require("../engine/bni/get_mutasi/index");

app.post("/mutation", handlerJOI.checkingSchemaGET_BNI ,async (req, res)=>{ 
  const { 
    startDate, 
    endDate,     
    account 
  } = req.body;
  const result = await getMutasiBNI.init(startDate,endDate,account);
  res.send({res:result, rekening : config.account[account].rekening});
});

module.exports = app;