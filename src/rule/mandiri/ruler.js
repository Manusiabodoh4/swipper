const joi = require('joi');

const schemaGET_MANDIRI = joi.object({
  startDate : joi.string()
    .alphanum()
    .required(),
  endDate : joi.string()
    .alphanum()
    .required(),  
  account : joi.number()
    .integer()
    .required()    
});

module.exports = {
  schemaGET_MANDIRI
}