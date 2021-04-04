const { schemaGET_BRI } = require("./ruler");

function checkingSchemaGET_BRI(req, res, next){
  const { error } = schemaGET_BRI.validate(req.body); 
  if(error){res.send({res:error}); return;}
  else next();
}

module.exports = {
  checkingSchemaGET_BRI
}