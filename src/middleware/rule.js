const joi = require('joi')

const middleBank  = (req, res, next) => {

  const schema = joi.object().keys({
    companyId : joi.string().required(),
    userId : joi.string().required(),
    password : joi.string().required(),
    rekening : joi.string().alphanum().required(),
    rekeningName: joi.string().optional(),
    startDate: joi.string().required(),
    endDate : joi.string().required()
  })

  const {error, value} = schema.validate(req?.body)
  
  if(error){
    return res.status(400).json({status:false, code:400, message:"Terjadi kesalahan pada reuest user", data:error})
  }

  req.valid = value

  next()

}

module.exports = {
  middleBank
}