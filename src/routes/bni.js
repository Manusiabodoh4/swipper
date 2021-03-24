const express = require('express');
const app = express.Router();

const handlerJOI = require("../rule/bni/handler");

const getMutasiBNI = require("../engine/bni/get_mutasi/index");

app.get("/mutation", handlerJOI ,async (req, res)=>{
  
  const { 
    startDate, 
    endDate, 
    rekening, 
    account 
  } = req.body;

  const result = await getMutasiBNI.init(startDate,endDate, rekening, account);
  
  res.send({res:result});

});

module.exports = app;