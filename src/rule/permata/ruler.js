const joi = require('joi');

const schemaGET_PERMATA = joi.object({
  startDate : joi.string()    
    .required(),
  endDate : joi.string()    
    .required(),  
  account : joi.number()
    .integer()
    .required()    
});

module.exports = {
  schemaGET_PERMATA
}