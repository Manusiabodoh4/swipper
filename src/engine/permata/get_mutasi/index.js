const Handler = require("./controller/handler");

const env = require("../../../env");
const { account3 } =  require("../../../config");

const linkLoginPermata = env.LINK_LOGIN_PERMATA;
const linkLogoutPermata = env.LINK_LOGOUT_PERMATA;

async function logout(browser,page){
  await page.goto(linkLogoutPermata, {waitUntil:"networkidle0", timeout:0});
  await browser.close();  
  if (browser && browser.process() != null) browser.process().kill('SIGINT');  
  console.log("Logout!");  
}

async function  init(startDate, endDate, numberAccount=0) {
  let data = [];

  let browser;

  console.log("Running!");

  try {
    browser = await Handler.configureBrowser();
  } catch (error) {
    console.log("Terjadi kesalahan pada Configure Browser!");
    return data;
  }

  let page;

  try {
    page = await Handler.configurePage(browser, linkLoginPermata);
  } catch (error) {
    console.log("Terjadi kesalahan pada Configure Page"); 
    return data; 
  }

  console.log("Berhasil Load Logi Page Permata! " + linkLoginPermata );

  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();    
  });

  try {
    await Handler.handlerInputCompanyID(page, account3[numberAccount].companyId);
    await Handler.handlerInputUserName(page, account3[numberAccount].userId);
    await Handler.handlerInputPassword(page, account3[numberAccount].password);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Input CompanyID, UserID, Password");
    await logout(browser, page);        
    return data;
  }

  console.log(`Berhasil input CompanyID = ${account3[numberAccount].companyId}, UserID = ${account3[numberAccount].userId}, Password = ${account3[numberAccount].password}`);

  try {
    console.log("Click Button Login!");
    await Handler.handlerClickLogin(page);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Click Login");
    await logout(browser, page);        
    return data;
  }

  console.log("Menuju Dashboard Page!");  

  console.log("Pending!");

  await page.waitForTimeout(5000);

  try {
    console.log("Click Menu!");
    await Handler.handlerClickMenu(page);
  } catch (error) {
    console.log('Terjadi Kesalahan ketika Click Menu!');    
    await logout(browser, page);        
    return data;
  }

  console.log("Pending.. Load Page Filter Mutasi");

  await page.waitForTimeout(5000);

  try {
    console.log("Click Delete Paramater!");
    await Handler.handlerClickDeleteParam(page);
  } catch (error) {
    console.log("Terjadi Kesalahan ketika Delete Parameter!");
    await logout(browser, page);
    return data;
  }
  
  console.log("Success Delete Parameter Filter Tanggal!");

  await page.waitForTimeout(2500);    

  try {
    console.log("Menuju Page Table Data Mutasi!");
    await Handler.handlerLinkForDataMutasi(page, account3[numberAccount].rekening, account3[numberAccount].rekeningName, startDate, endDate);
  } catch (error) {
    console.log("Terjadi Kesalahan ketika Load Table Data Mutasi!");
    await logout(browser, page);
    return data;
  }

  console.log("Berhasil Masuk Page Table Mutasi!");

  await page.waitForTimeout(5000);

  try {
    console.log("Mencoba mengambil data table mutasi!");
    data = await Handler.handlerGetDataTable(page);
  } catch (error) {
    console.log("Terjadi kesalahan ketika mengambil data table mutasi");
    await logout(browser, page);
    return data;
  }

  // if(!isLogOut){
  //   await page.goto(linkLogoutPermata, {waitUntil:"networkidle0"});
  //   console.log("Berhasil Logout!");
  // }

  await logout(browser, page);

  return data;

}

module.exports = {init}