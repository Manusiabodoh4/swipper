const Handler = require("./ruler");

function checkingSchemaGET_PERMATA(req, res, next){
  const { error } = Handler.schemaGET_PERMATA.validate(req.body); 
  if(error){res.send({res:error}); return;}
  else next();
}

module.exports = {
  checkingSchemaGET_PERMATA
}