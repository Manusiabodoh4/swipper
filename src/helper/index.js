const pup = require('puppeteer-extra').default

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pup.use(StealthPlugin())

const { io } = require('socket.io-client')

const socket = io(`http://${process.env.REALTIME_SERVER}:${process.env.REALTIME_PORT}/`)

module.exports = () => {

  const configureBrowser = async () => {
    socket.connect();
    try {
      const browser = await pup.launch({    
        headless: true, 
        ignoreHTTPSErrors: true,
        slowMo: 0,
        args : [      
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu"
        ]
      });
      socket.emit("logger", {status:true, message:"Browser berhasil dibuat"})
      return browser;
    } catch (error) {
      socket.emit("logger", {status:false, message:"Browser gagal dibuat"})
      throw error
    }        
  }

  const configurePage = async (browser = new pup.Browser(), link) => {
    try {
      const page = await browser.newPage();  
      await page.setBypassCSP(true);
      //await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36");      
      await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36")
      await page.setViewport( { 'width' : 1024, 'height' : 1024 } ); 
      socket.emit("logger", {status:true, message:"Page berhasil dibuat"})
      await page.goto(link, {waitUntil:"networkidle0", timeout:0});      
      socket.emit("logger", {status:true, message:`Page berhasil membuka ${link}`})
      return page; 
    } catch (error) {
      socket.emit("logger", {status:false, message:`Page gagal berhasil buka`})
      throw error
    }    
  }

  const closeBrowser = async (browser = new pup.Browser()) => {
    try {
      await browser.close()
      socket.emit("logger", {status:true, message:"Browser berhasil di tutup"}) 
    } catch (error) {
      socket.emit("logger", {status:false, message:"Browser gagal di tutup"}) 
    }    
  }

  const getFrame = (name, page) => {
    const frame = page.frames().find((frame) => frame.name() === name);
    return frame
  }

  const getObject = async (xpath, page) => {
    xpath = (xpath||"")
    const ob = await page.$x(xpath)
    return ob[0]
  }

  const inputText = async (xpath, text, delay, page) => {    
    xpath = (xpath||"")
    text = (text||"")
    delay = (delay||100)

    try {
      const txt = await page.$x(xpath)
      txt[0].focus()
      txt[0].type(text, {delay})

      socket.emit('logger', {status:true, message:`Berhasil memasukan input dengan value ${text}`})
    } catch (error) {
      socket.emit('logger', {status:false, message:`Gagal memasukan input dengan value ${text}`})
      throw error
    }    
  }

  const clickButton = async (xpath, clickCount, page) => {

    xpath = (xpath||"")    
    clickCount = (clickCount||1)

    try {
      const btn = await page.$x(xpath)
      await btn[0].click({clickCount})

      socket.emit('logger', {status:true, message:`Button berhasil di klik`})
    } catch (error) {
      socket.emit('logger', {status:false, message:`Button gagal di klik`})
      throw error
    }    
  }

  const clickNavigation = async (xpath, clickCount, page) => {

    xpath = (xpath||"")    
    clickCount = (clickCount||1)

    try {
      const btn = await page.$x(xpath)
      await btn[0].click({clickCount})
      await page.waitForNavigation({waitUntil:"networkidle2",  timeout: 0})

      socket.emit('logger', {status:true, message:`Button berhasil di klik untuk navigation`}) 
    } catch (error) {      
      socket.emit('logger', {status:false, message:`Button gagal di klik untuk navigation`}) 
      throw error
    }    

  }

  const clickNavigationWithFrame = async (xpath, clickCount, frame, page) => {

    xpath = (xpath||"")    
    clickCount = (clickCount||1)

    try {
      const btn = await frame.$x(xpath)
      await btn[0].click({clickCount})
      await page.waitForNavigation({waitUntil:"networkidle2",  timeout: 0})

      socket.emit('logger', {status:true, message:`Button berhasil di klik untuk navigation`}) 
    } catch (error) {
      socket.emit('logger', {status:false, message:`Button gagal di klik untuk navigation`}) 
      throw error
    }    

  }

  const goto = async (link, page) => {

    link = (link||"")

    try {
      await page.goto(link, {waitUntil:"networkidle2", timeout:0})

      socket.emit('logger', {status:true, message:`Goto ${link}`}) 
    } catch (error) {
      socket.emit('logger', {status:false, message:`Gagal goto ${link}`}) 
      throw error
    }    

  }

  const getLengthChildren = async (xpath, page) => {

    xpath = (xpath||"")

    const element = await page.$x(xpath);
    
    const children = await element[0].getProperty('children');
    
    const len = await (await children.getProperty('length')).jsonValue();
    
    return len

  }

  const getText = async (xpath, page) => {

    xpath = (xpath||"")

    try {
     
      const element = await page.$x(xpath);
    
      const propertiText = await element[0].getProperty('textContent');

      const text = await propertiText.jsonValue()

      return text

    } catch (error) {
      return ""
    }    

  }


  return {
    configureBrowser,
    configurePage,
    closeBrowser,
    inputText,
    clickButton,
    clickNavigation,
    getObject,
    getFrame,
    clickNavigationWithFrame,
    goto,
    getLengthChildren,
    getText
  }

}