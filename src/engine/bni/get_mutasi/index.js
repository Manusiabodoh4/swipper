const Handler = require("./helper/handler");

const companyID = "SYARIAHKOIN";

const account = [{userid: "SYKOINDO1",password : "Rahasia99"},{userid : "SYKOINDO2",password : "aLIFAH20"}]

const linkLogin = "https://bnidirectng.bni.co.id/corp/common/login.do?action=loginRequest"
const linkMutasi = "https://bnidirectng.bni.co.id/corp/front/transactioninquiry.do?action=transactionByDateRequest&menuCode=MNU_GCME_040200";
const linkLogout = "https://bnidirectng.bni.co.id/corp/common/login.do?action=logout";

async function init(startDate, endDate, rekening = "8070020005" , numberAccount=0){

  const chooseAccount = numberAccount;
  
  const page = await Handler.configureBrowser(linkLogin);

  let status = new String();

  let data = [];

  try {

    console.log("Finish Load Login");
      
    await Handler.handlerInputCompanyID(page, companyID);
    await Handler.handlerInputUserID(page, account[chooseAccount].userid);
    await Handler.handlerInputPassword(page, account[chooseAccount].password); 
    
    console.log("Finish Input CompanyID, UserID, Password");

    await Handler.handlerClickLogin(page);  
    
    console.log("Success Load Home Page");  
    
    await page.waitForTimeout(1000);

    await page.goto(linkMutasi, {waitUntil:"networkidle2"});  

    console.log("Success Load Mutasi Page");
    
    await Handler.handlerDeletePostingDate(page);
    await Handler.handlerAddDateParameter(page, startDate, endDate, rekening);

    console.log("Success Add Parameter Date And Rekening");

    await Handler.handlerClickShowData(page);  

    console.log("Success Load Table Data Mutasi!");

    await page.waitForTimeout(5000);

    console.log("TRY GET DATA");

    try {
      data = await Handler.handlerGetDataMutasi(page);          
    } catch (error) {
      status = "Data Kosong";
    } 
    
  } catch (error) {    
    console.log(error);
  }

  console.log(status);

  await page.waitForTimeout(10000);
  await page.goto(linkLogout, {waitUntil:"networkidle0"});

  console.log("Success Log-Out!");

  return data;
  
}

module.exports = {init};


