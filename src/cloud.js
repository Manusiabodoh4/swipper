const cloudinary = require('cloudinary').v2;
const util = require('util');

const uploadAsync = util.promisify(cloudinary.uploader.upload);

cloudinary.config({
  cloud_name: 'swipper', 
  api_key: '512794683911763', 
  api_secret: 'Ifv5FE_cZ31DAtMN2r9uTjNsezI' 
});

async function upload(){
  return await uploadAsync("./img/screenshot.png");
}

module.exports = {upload};
