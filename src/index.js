const Handler = require("./handler");

const companyID = "SYARIAHKOIN";

const userID = "SYKOINDO1";
const password = "Rahasia99";

//const userID = "SYKOINDO2";
//const password = "aLIFAH20";

const linkLogin = "https://bnidirectng.bni.co.id/corp/common/login.do?action=loginRequest"
const linkMutasi = "https://bnidirectng.bni.co.id/corp/front/transactioninquiry.do?action=transactionByDateRequest&menuCode=MNU_GCME_040200";
const linkLogout = "https://bnidirectng.bni.co.id/corp/common/login.do?action=logout";

async function init(){
  
  const page = await Handler.configureBrowser(linkLogin);

  console.log("Finish Load");
    
  await Handler.handlerInputCompanyID(page, companyID);
  await Handler.handlerInputUserID(page, userID);
  await Handler.handlerInputPassword(page, password); 
  
  await Handler.handlerClickLogin(page);

  console.log("Done");  

  await page.waitForTimeout();

  await page.goto(linkMutasi);
  
  await Handler.handlerDeletePostingDate(page);
  await Handler.handlerAddDateParameter(page, "22032021", "23032021", "8070020005");

  await Handler.handlerClickShowData(page);

  await page.waitForTimeout(10000);

  await page.goto(linkLogout);

  console.log("Finish Load Mutasi");

}

init();


