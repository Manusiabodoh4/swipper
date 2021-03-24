const joi = require('joi');

const schemaGET_BNI = joi.object({
  startDate : joi.string()
    .alphanum()
    .required(),
  endDate : joi.string()
    .alphanum()
    .required(),
  rekening : joi.string()
    .alphanum(),    
  account : joi.number()
    .integer()
    .min(0)
    .max(1)    
});

module.exports = {
  schemaGET_BNI
}