const puppeteer = require('puppeteer');
const $ = require('cheerio');
const { registerCustomQueryHandler } = require('puppeteer');

// const puppeteer = require('puppeteer-extra')

// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())

async function configureBrowser(link){
  
  const browser = await puppeteer.launch({    
    headless:false, 
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
  
  const page = await browser.newPage();
  
  await page.setBypassCSP(true);

  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");  

  await page.setDefaultNavigationTimeout( 100000 );

  await page.setViewport( { 'width' : 1024, 'height' : 1024 } );

  await page.setRequestInterception(true);
    
  page.on('request', (req) => {
    if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
      req.abort();
    }
    else {
      req.continue();
    }
  });
  
  await page.goto(link, {waitUntil:"networkidle0"});  
  
  return page;
  
}

async function getLinkLoginPage(page= new puppeteer.Page){
  const html = await page.evaluate(()=> document.body.innerHTML);
  const a = $("a", html)[1].attribs?.href;  
  await Promise.all([
    page.click("a[href='"+a+"']"),  
    page.waitForNavigation()
  ]);
}

async function handlerInputCompanyID(page=new puppeteer.Page, companyID){    
  const html = await page.evaluate(()=>document.body.innerHTML);  
  const input = $("input", html)[0];
  //console.log(input);
  if(input === undefined) await handlerInputCompanyID(page, password);
  else{        
    const input2 = await page.$(`input[name='${input.attribs?.name}']`);
    //console.log(input2);
    await input2.focus(); 
    await input2.type(companyID, {delay:50});     
  }
}

async function handlerInputUserID(page = new puppeteer.Page(), userID){
  const html = await page.evaluate(()=>document.body.innerHTML);  
  const input = $("input", html)[1];
  //console.log(input);
  if(input === undefined) await handlerInputUserID(page, password);
  else{        
    const input2 = await page.$(`input[name='${input.attribs?.name}']`);
    //console.log(input2);
    await input2.focus(); 
    await input2.type(userID, {delay:50});     
  }
}

async function handlerInputPassword(page=new puppeteer.Page, password){
  const html = await page.evaluate(()=>document.body.innerHTML);  
  const input = $("input", html)[2];
  //console.log(input);
  if(input === undefined) await handlerInputPassword(page, password);
  else{        
    const input2 = await page.$(`input[name='${input.attribs?.name}']`);
    //console.log(input2);
    await input2.focus(); 
    await input2.type(password, {delay:50});     
  }
}

async function handlerDeletePostingDate(page = new puppeteer.Page()) {
  await page.evaluate(()=>document.body.innerHTML);    
  const item = await page.$$("img");
  item[1].click();
  item[3].click();
  console.log("Delete Success");  
}

async function handlerStartDate(page=new puppeteer.Page(), startDate){  
  const html = await page.evaluate(()=>document.body.innerHTML);      
  const date1 = await page.$("input[name='transferDateDisplay1']");
  await date1.focus();
  await date1.type(startDate, {delay:500});
}

async function handlerEndDate(page=new puppeteer.Page(), endDate){
  await page.evaluate(()=>document.body.innerHTML);    
  const date2 = await page.$("input[name='transferDateDisplay2']");
  await date2.focus();
  await date2.type(endDate, {delay:500});
}

async function handlerRekening(page=new puppeteer.Page(), rekening){
  await page.evaluate(()=>document.body.innerHTML);    
  const date3 = await page.$("input[name='accountDisplay']");
  await date3.focus();
  await date3.type(rekening, {delay:100});  
}

async function handlerAddDateParameter(page = new puppeteer.Page(), startDate, endDate, rekening){
  await handlerStartDate(page, startDate);
  await handlerEndDate(page, endDate);
  await handlerRekening(page, rekening);
}

async function handlerClickShowData(page = new puppeteer.Page()){
  await page.evaluate(()=>document.body.innerHTML);    
  const btnShow = await page.$("input[name='show1'],input[type='button']");
  await Promise.all([
    btnShow.click({clickCount:1}),  
    page.waitForNavigation(), 
  ]);
}

async function handlerClickLogin(page = new puppeteer.Page()){    
  await Promise.all([
    page.click(`input[name='submit1']`, {clickCount:1}),  
    page.waitForNavigation({waitUntil:"networkidle0"}), 
  ]);
}

async function createObjectFromTable(element = new Element){    
  const header = element.children[0];
  const countHeader = header.children.length;
  let itemHeader = new Array();  
  for(let i=0;i<countHeader;i++){    
    const tmpstr = new String(header.children[i].children[0].children[0]?.data);
    const str = tmpstr.replace(" ","").replace(".", "").replace("/", "");
    itemHeader.push(str);
  }  
  return itemHeader;
}

async function getDataFromDataTable(element = new Element, index = new Number){  
  if(index < 1) return [];
  const wrapData = element.children[index];
  const countData = wrapData.children.length;  
  let itemData = new Array();
  for(let i=0;i<countData;i++){    
    itemData.push(wrapData.children[i].children[0]?.data);
  }
  return itemData;
}

async function handlerGetDataMutasi(page=new puppeteer.Page()){
  
  const html = await page.evaluate(()=>document.body.innerHTML);
  
  const tbody = $('tbody', html)[2];
  const countData = tbody.children.length;
  
  console.log(`Banyak Data : ${countData-1}`);

  let result = new Array();

  const itemHeader = await createObjectFromTable(tbody);  

  for(let i=1;i<countData;i++){
    const itemData = await getDataFromDataTable(tbody, i);
    let obj = {};
    for(let j=0;j<itemHeader.length;j++){      
      obj[itemHeader[j]] = itemData[j];
    }
    result.push(obj);
  }

  console.log(result);

  return result;

}

module.exports = {
  handlerClickLogin,
  configureBrowser,
  handlerInputCompanyID,
  handlerInputPassword,
  getLinkLoginPage,
  handlerInputUserID ,
  handlerDeletePostingDate,
  handlerAddDateParameter,
  handlerClickShowData,
  handlerGetDataMutasi
}