const puppeteer = require('puppeteer-extra').default;
puppeteer.use(require('puppeteer-extra-plugin-stealth')());

const $ = require('cheerio');

const env = require("../../../../env");

async function configureBrowser(){  
  
  const browser = await puppeteer.launch({    
    headless: (env.HEADLESS === "true"), 
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
  
  return browser;

}

async function configurePage(browser = new puppeteer.Browser(), link){
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");    
  await page.setDefaultNavigationTimeout(120000);
  await page.setViewport( { 'width' : 1024, 'height' : 1024 } );
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if(req.resourceType() == 'font' || req.resourceType() == 'image'){
      req.abort();
    }
    else {
      req.continue();
    }
  });"frame[id='menuFrameId']"
  await page.goto(link, {waitUntil:"networkidle0", timeout:0});  
  return page;
}

async function handlerInputCompanyID(page = new puppeteer.Page, cId=new String()){  
  await page.evaluate(()=> document.body.innerHTML);
  const name = "corpId"
  const companyId = await page.$(`input[name=${name}]`);
  await companyId.focus();
  await companyId.type(cId, {delay:50});
}

async function handlerInputUserName(page = new puppeteer.Page, username=new String()){  
  await page.evaluate(()=> document.body.innerHTML);
  const name = "userName"
  const userName = await page.$(`input[name=${name}]`);
  await userName.focus();
  await userName.type(username, {delay:50});
}

async function handlerInputPassword(page = new puppeteer.Page, password=new String()){  
  await page.evaluate(()=> document.body.innerHTML);
  const name = "passwordEncryption"
  const pass = await page.$(`input[name=${name}]`);
  await pass.focus();
  await pass.type(password, {delay:50});
}

async function handlerClickLogin(page = new puppeteer.Page){  
  await page.evaluate(()=> document.body.innerHTML);
  const tipe = "submit";
  const id = "button";
  const login = await page.$(`input[type=${tipe}], input[id=${id}]`);
  await Promise.all([
    login.click({clickCount:1}),  
    page.waitForNavigation({waitUntil:"domcontentloaded", timeout:0}),
  ]);
}

async function handlerClickMenu(page= new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMenu = await page.$("frame[id='menuFrameId']");

  const frame = await frameMenu.contentFrame();  

  const a = await frame.$$("a");  

  await a[1].click({clickCount:1});

  await a[3].click({clickCount:1});

}

async function handlerClickDeleteParam(page= new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='mainFrame']");

  const frame = await frameMain.contentFrame();   

  const img = await frame.$$("img[src='/common/image/Eraser.gif']");    

  await img[0].click({clickCount:1});

  await img[1].click({clickCount:1});

}

async function handlerAddStartDate(page= new puppeteer.Page, startDate){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='mainFrame']");

  const frame = await frameMain.contentFrame();   

  await frame.evaluate(()=> {    
    document.querySelector("input[name='transferDateDisplay1']").disabled = false;
  });

  const input = await frame.$("input[name='transferDateDisplay1']");      

  await input.focus();

  await input.type(startDate, {delay:500});  

}

async function handlerAddEndDate(page= new puppeteer.Page, endDate){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='mainFrame']");

  const frame = await frameMain.contentFrame();   

  await frame.evaluate(()=> {    
    document.querySelector("input[name='transferDateDisplay2']").disabled = false;
  });

  const input = await frame.$("input[name='transferDateDisplay2']");    

  await input.focus();

  await input.type(endDate, {delay:500});  

}

async function handlerAddRekening(page= new puppeteer.Page, rekening){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='mainFrame']");

  const frame = await frameMain.contentFrame();     

  const input = await frame.$("input[name='accountDisplay']");     

  await input.focus();

  await input.type(rekening, {delay:100});  

}

async function handlerClickShow(page= new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='mainFrame']");

  const frame = await frameMain.contentFrame();     

  const button = await frame.$("input[name='show1'], input[type='button']");   

  await button.click({clickCount:1});

}

async function handlerGetDataHeader(page=new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='mainFrame']");

  const frame = await frameMain.contentFrame();     

  const frameString = await frame.evaluate(() => document.body.innerHTML);

  const data = $("tbody > tr[class='clsTable']", frameString)[0];  

  const lengItemHeader = data.children.length;  

  let header = [];

  for(let i=0;i<lengItemHeader;i++){
    try {

      const tmpstr = new String(data?.children[i]?.children[0]?.data);        
      
      const str = tmpstr.replace("/^ &\.$/ig", "");
      
      //console.log(str);
      
      header.push(str);    

    } catch (error) {}
  }  

  return header

}

async function handlerGetDataTable(page=new puppeteer.Page){  

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='mainFrame']");

  const frame = await frameMain.contentFrame();     

  const frameString = await frame.evaluate(() => document.body.innerHTML);

  const data = $("tbody > tr[class='clsEven']", frameString);  

  const lengItemData = data.length;  

  let table = [];  

  const prop = await handlerGetDataHeader(page);  

  for(let i=5;i<lengItemData;i++){
    const len = data[i].children.length;      
    let tmpData;
    let index=0;
    let obj = {};
    for(let j=0;j<len;j++){
      if(len >= 13){

        if(j % 2 == 1){
          
          if(data[i].children[j].name == "td"){
            tmpData = data[i].children[j]?.children[0]?.data;            
            if(tmpData != undefined){              
              //obj[prop[index]] = (new String(tmpData)).replaceAll("\t", "").replaceAll("\n", "").replaceAll(" ", "");                         
              obj[prop[index]] = (new String(tmpData));                         
            }            
            else{
              obj[prop[index]] = tmpData;
            }
            index++; 
          }
        }
      }       
    }
    if(Object.keys(obj).length > 0){
      table.push(obj); 
    }
  }

  console.log(table);
   
  return table;
} 



module.exports = {
  configureBrowser,
  configurePage,
  handlerInputCompanyID,
  handlerInputPassword,
  handlerInputUserName,
  handlerClickLogin,
  handlerClickMenu,
  handlerClickDeleteParam,
  handlerAddStartDate,
  handlerAddEndDate,
  handlerAddRekening,
  handlerClickShow,
  handlerGetDataHeader,
  handlerGetDataTable
}