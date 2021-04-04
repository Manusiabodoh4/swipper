const puppeteer = require('puppeteer-extra').default;
puppeteer.use(require('puppeteer-extra-plugin-stealth')());

const $ = require('cheerio');

const env = require("../../../../env");

async function configureBrowser(){

  return await puppeteer.launch({
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

}

async function configurePage(browser = new puppeteer.Browser, link){
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");      
  await page.setViewport( { 'width' : 1024, 'height' : 1024 } );
  // await page.setRequestInterception(true);
  // page.on('request', (req) => {
  //   if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
  //     req.abort();
  //   }
  //   else {
  //     req.continue();
  //   }
  // });
  await page.goto(link, {waitUntil:"networkidle0", timeout:0});   
  return page;
}

async function handlerExitPengumuman(page = new puppeteer.Page){
  const html = await page.evaluate(() => document.body.innerHTML);
  const btnExit = $("a[id='TB_closeWindowButton']", html);
  if(btnExit == null){
    return;
  }
  else{
    await page.click("a[id='TB_closeWindowButton']");            
    return;
  }
}

async function handlerInputCompanyID(page=new puppeteer.Page, companyID){    
  const html = await page.evaluate(()=>document.body.innerHTML);  
  const input = $("input", html)[6];  
  if(input === undefined) await handlerInputCompanyID(page, companyID);
  else{            
    const input2 = await page.$(`input[name='${input.attribs?.name}']`);    
    await input2.focus(); 
    await input2.type(companyID, {delay:50});     
  }
}

async function handlerInputUserID(page = new puppeteer.Page(), userID){
  const html = await page.evaluate(()=>document.body.innerHTML);  
  const input = $("input", html)[7];  
  if(input === undefined) await handlerInputUserID(page, userID);
  else{            
    const input2 = await page.$(`input[name='${input.attribs?.name}']`);    
    await input2.focus(); 
    await input2.type(userID, {delay:50});     
  }
}

async function handlerInputPassword(page=new puppeteer.Page, password){
  const html = await page.evaluate(()=>document.body.innerHTML);  
  const input = $("input", html)[8];  
  if(input === undefined) await handlerInputPassword(page, password);
  else{        
    const input2 = await page.$(`input[name='${input.attribs?.name}']`);    
    await input2.focus(); 
    await input2.type(password, {delay:50});     
  }
}

async function handlerClickLogin(page = new puppeteer.Page){
  await Promise.all([
    page.click(`a[id='btnLogin']`, {clickCount:1}),  
    page.waitForNavigation({waitUntil:"networkidle2",  timeout: 0}), 
  ]);
}

async function handlerClickLogOut(page = new puppeteer.Page){
  
  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='head']");

  const frame = await frameMain.contentFrame();   

  const btn = await frame.$("a[id='btnLogout']");

  await Promise.all([
    btn.click({clickCount:1}),  
    page.waitForNavigation({waitUntil:'networkidle0', timeout:0}), 
  ]);

}

async function handlerClickAccountInformation(page = new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='head']");

  const frame = await frameMain.contentFrame();   

  const btn = await frame.$$("a[class='menu-item']");

  await btn[1].click({clickCount:1});  

}

async function handlerClickAccountInformationSide(page = new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='menu']");

  const frame = await frameMain.contentFrame();   

  const btn = await frame.$$("td[class='menu']");

  await btn[0].click({clickCount:1});        

}

async function handlerClickAccountStatement(page = new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='menu']");

  const frame = await frameMain.contentFrame();   

  const btn = await frame.$$("a[target='channel']");

  await btn[3].click({clickCount:1});  
  
  //await page.waitForSelector("form[name='aspnetForm']");

}

async function handlerInputRekening(page = new puppeteer.Page, rekening){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='channel']");

  const frame = await frameMain.contentFrame();   

  const input = await frame.$("input[name='ctl00$TransactionForm$txtNoRek']");

  await input.focus();

  await input.type(rekening, {delay:100});

}

async function handlerInputStartDate(page = new puppeteer.Page, startDate){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='channel']");

  const frame = await frameMain.contentFrame();   

  await frame.evaluate(()=> {    
    document.querySelector("input[name='ctl00$TransactionForm$txtstartdate']").value = "";
  });

  const input = await frame.$("input[name='ctl00$TransactionForm$txtstartdate']");

  await input.focus();

  await input.type(startDate, {delay:250});

}

async function handlerInputEndDate(page = new puppeteer.Page, endDate){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='channel']");

  const frame = await frameMain.contentFrame(); 
  
  await frame.evaluate(()=> {    
    document.querySelector("input[name='ctl00$TransactionForm$txtfindate']").value = "";
  });

  const input = await frame.$("input[name='ctl00$TransactionForm$txtfindate']");

  await input.focus();

  await input.type(endDate, {delay:250});

}

async function handlerClickGetData(page = new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='channel']");

  const frame = await frameMain.contentFrame();   

  const btn = await frame.$("input[name='ctl00$TransactionForm$btnSubmit']");

  await btn.click({clickCount:1});  
  
  await frame.waitForSelector("div[id='ctl00_TransactionForm_panelRV']", {timeout:0});

  await frame.waitForSelector("iframe[name='ReportFramectl00_TransactionForm_ReportViewer1']", {timeout:0});

}

async function handlerLoadContentPageTableData(page = new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='channel']");

  const frame = await frameMain.contentFrame();  

  await frame.evaluate(()=> document.body.innerHTML);

  const iFrameMain = await frame.$("iframe[name='ReportFramectl00_TransactionForm_ReportViewer1']");

  const contentIfFrame = await iFrameMain.contentFrame();

  const urlFrame = contentIfFrame.childFrames()[1]?._url;

  await page.goto(urlFrame, {waitUntil:"networkidle0", timeout:0});  

}

async function handlerGetDataFromContentFrameMutasi(page = new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const table = await page.$("tr[valign='top'] > td[colspan='4']");

  const itemTable = await table.$$("tr[valign='top']");

  const countData = itemTable.length;

  console.log("Banyak Data : "+ countData);  

  const contentString = await page.evaluate(()=> document.querySelector("tr[valign='top'] > td[colspan='4']").innerHTML);

  const data = $("tr[valign='top'] > td > div", contentString);
  
  const countItemData = data.length;

  let header = [];  

  let result = [];

  //let indexObj = 0;

  let obj = {};

  for(let i=0;i<countItemData;i++){
    if(data[i]?.children[0]?.type == "text"){

      let tmp = data[i]?.children[0]?.data;

      if(i <= 4){
        header.push(tmp);        
        if(i == 4){
          header.push("DATE");
        }
      }      

      else{            

        let indexMod = i % 6;
        
        obj[header[indexMod]] = tmp;                

        if(indexMod == 4){                    
          result.push(obj);
          obj = {};
        }

      }
    }  
  }  

  console.log(result);

  return result;  

}



module.exports = {
  configureBrowser,
  configurePage,
  handlerExitPengumuman,
  handlerInputCompanyID,
  handlerInputPassword,
  handlerInputUserID,
  handlerClickLogin,
  handlerClickLogOut,
  handlerClickAccountInformation,
  handlerClickAccountInformationSide,
  handlerClickAccountStatement,
  handlerInputRekening,
  handlerInputStartDate,
  handlerInputEndDate,
  handlerClickGetData,
  handlerLoadContentPageTableData,
  handlerGetDataFromContentFrameMutasi
}