const cloudinary = require('cloudinary').v2;
const util = require('util');

const env = require("../../env.js");;

const uploadAsync = util.promisify(cloudinary.uploader.upload);

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME, 
  api_key: env.CLOUDINARY_APIKEY, 
  api_secret: env.CLOUDINARY_APISECRET 
});

async function upload(){
  return await uploadAsync("./img/screenshot.png");
}

module.exports = {upload};
