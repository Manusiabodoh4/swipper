require('esbuild').buildSync({
  entryPoints : ["src/index.js"],
  bundle : true,
  platform : "node",
  target : ["node14.16"],
  external : ["http", 
  "fs", 
  "path", 
  "events", 
  "querystring", 
  "crypto", 
  "puppeteer"],
  outfile : "app.js"
});