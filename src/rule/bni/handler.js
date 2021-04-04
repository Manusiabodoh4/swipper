const { schemaGET_BNI } = require("./ruler");

function checkingSchemaGET_BNI(req, res, next){
  const { error } = schemaGET_BNI.validate(req.body); 
  if(error){res.send({res:error}); return;}
  else next();
}

module.exports = {
  checkingSchemaGET_BNI
}