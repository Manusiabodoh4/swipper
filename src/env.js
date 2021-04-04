require('dotenv').config();

module.exports = {
  LINK_LOGIN           : process.env.LINK_LOGIN,
  LINK_MUTASI          : process.env.LINK_MUTASI,
  LINK_LOGOUT          : process.env.LINK_LOGOUT,
  REKENING             : process.env.REKENING_DEFAULT,
  COMPANYID            : process.env.ACCOUNT_COMPANYID,
  USERID1              : process.env.ACCOUNT_USERID1,
  USERID2              : process.env.ACCOUNT_USERID2,
  PASSWORD1            : process.env.ACCOUNT_PASSWORD1,
  PASSWORD2            : process.env.ACCOUNT_PASSWORD2,
  PORT                 : process.env.PORT,
  CLOUDINARY_NAME      : process.env.CLOUDINARY_NAME,
  CLOUDINARY_APIKEY    : process.env.CLOUDINARY_APIKEY,
  CLOUDINARY_APISECRET : process.env.CLOUDINARY_APISECRET,
  HEADLESS             : process.env.HEADLESS,
  LINK_LOGIN_MANDIRI   : process.env.LINK_LOGIN_MANDIRI,
  LINK_LOGIN2_MANDIRI  : process.env.LINK_LOGIN2_MANDIRI,
  LINK_LOGOUT_MANDIRI  : process.env.LINK_LOGOUT_MANDIRI,
  LINK_LOGIN_PERMATA   : process.env.LINK_LOGIN_PERMATA,
  LINK_LOGOUT_PERMATA  : process.env.LINK_LOGOUT_PERMATA,
  LINK_LOGIN_BRI       : process.env.LINK_LOGIN_BRI,
  LINK_MAIN_BRI        : process.env.LINK_MAIN_BRI
}