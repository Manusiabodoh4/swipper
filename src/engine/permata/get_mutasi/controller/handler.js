
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
  await companyId.type(cId, {delay:100});
}

async function handlerInputUserName(page = new puppeteer.Page, username=new String()){  
  await page.evaluate(()=> document.body.innerHTML);
  const name = "userName"
  const userName = await page.$(`input[name=${name}]`);
  await userName.focus();
  await userName.type(username, {delay:100});
}

async function handlerInputPassword(page = new puppeteer.Page, password=new String()){  
  await page.evaluate(()=> document.body.innerHTML);
  const name = "passwordEncryption"
  const pass = await page.$(`input[name=${name}]`);
  await pass.focus();
  await pass.type(password, {delay:100});
}

async function handlerClickLogin(page = new puppeteer.Page){  
  await page.evaluate(()=> document.body.innerHTML);
  const tipe = "button";
  const name = "submit1";
  const login = await page.$(`input[type=${tipe}], input[name=${name}]`);
  await Promise.all([
    login.click({clickCount:1}),  
    page.waitForNavigation(), 
  ]);
}

async function handlerClickDeleteParam(page= new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMain = await page.$("frame[name='mainFrame']");

  const frame = await frameMain.contentFrame();   

  const img = await frame.$$("img[src='/common/image/Eraser.gif']");    

  await img[0].click({clickCount:1});

  await img[1].click({clickCount:1});

}

async function handlerClickMenu(page= new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameMenu = await page.$("frame[name='menuFrame']");

  const frame = await frameMenu.contentFrame();  

  const classDiv = 'menu';

  const div = await frame.$$(`div[class='${classDiv}']`);  

  await div[2].click({clickCount:1});

  const idAhref = 'subs15';

  const a = await frame.$(`a[id=${idAhref}]`);

  await a.click({clickCount:1});

}


async function handlerLinkForDataMutasi(page = new puppeteer.Page, rekening ,rekeningName, startDate, endDate){

  await page.evaluate(()=> document.body.innerHTML);

  const generateStartDate = startDate?.split("-");

  const generateEndDate = endDate?.split("-");

  const generateLink = `https://www.permatae-business.com/corp/front/transactioninquiry.do?action=getListTransactionByDate&accountNumber=${rekening}&accountNm=${rekeningName}&currDisplay=IDR&day1=${generateStartDate[0]}&mon1=${generateStartDate[1]}&year1=${generateStartDate[2]}&day2=${generateEndDate[0]}&mon2=${generateEndDate[1]}&year2=${generateEndDate[2]}&trxFilter=%`;

  console.log(generateLink);

  await page.goto(generateLink, {waitUntil:"networkidle0", timeout:0});

}

async function handlerGetHeaderData(page = new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameData = await page.$("iframe[name='viewHtmlFrame']");

  const frame = await frameData.contentFrame();    

  const frameString  =  await frame.evaluate(()=>document.body.innerHTML)

  const tbody = $("tbody", frameString)[1];  

  const trHeader = tbody.children[20];

  const td = trHeader.children;  

  const leng = td.length;

  const header = [];

  let count = 0;

  for(let i=0;i<leng;i++){
    if(td[i]?.name == "td"){
      count++;
    }
  }
  
  if(count == 12){
    for(let i=0;i<leng;i++){    
      if(td[i]?.name == "td"){      
        const span = td[i];      
        if(span?.children[0]?.name == "span"){        
          const strHeader = new String(span?.children[0]?.children[0]?.data);        
          header.push(strHeader);        
        }      
      }
    }
  }

  return header;

}

async function handlerGetDataTable(page = new puppeteer.Page){

  await page.evaluate(()=> document.body.innerHTML);

  const frameData = await page.$("iframe[name='viewHtmlFrame']");

  const frame = await frameData.contentFrame();    

  const frameString  =  await frame.evaluate(()=>document.body.innerHTML)

  const tbody = $("tbody", frameString)[1];

  const lengDatainTable = tbody.children.length;  

  let data = [];  

  let header = [];

  for(let i=20;i<lengDatainTable;i++){    

    const trData = tbody.children[i];

    if(trData?.name == "tr"){      

      let obj = {};      
      
      const lenTdData = trData?.children?.length;

      let count = 0;

      for(let i=0;i<lenTdData;i++){
        if(trData?.children[i]?.name == "td"){
          count++;
        } 
      }

      if(count == 12){

        for(let j=0;j<lenTdData;j++){        

          const tdData = trData?.children[j];        

          if(tdData?.name == 'td'){                  

            const spanData = tdData?.children[0];

            if(spanData?.name == 'span'){
              
              const textData = spanData?.children[0]

              if(textData?.type == 'text'){  
                
                if(i == 20){                  
                  header[j] = textData?.data;
                  //console.log(header[j]);
                }

                else{
                  obj[header[j]] = textData?.data;
                }
                
                // data.push({
                //   index : j,
                //   value: textData?.data
                // })

              }

            }                    

          }            

        } 
        
      } 
      
      if(Object.keys(obj).length > 0){
        data.push(obj);
      }
    }

  }    

  console.log(data);

  return data;
}




module.exports = {
  configureBrowser,
  configurePage,
  handlerInputCompanyID,
  handlerInputUserName,
  handlerInputPassword,
  handlerClickLogin,
  handlerClickMenu,
  handlerLinkForDataMutasi,
  handlerGetHeaderData,
  handlerClickDeleteParam,
  handlerGetDataTable
}