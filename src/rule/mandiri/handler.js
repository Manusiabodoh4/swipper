const { schemaGET_MANDIRI } = require("./ruler");

function checkingSchemaGET_MANDIRI(req, res, next){
  const { error } = schemaGET_MANDIRI.validate(req.body); 
  if(error){res.send({res:error}); return;}
  else next();
}

module.exports = {
  checkingSchemaGET_MANDIRI
}