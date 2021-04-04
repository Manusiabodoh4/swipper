const Handler = require('./controller/handler');

const env = require("../../../env");
const { account2 } = require("../../../config");

const linkLogout = env.LINK_LOGOUT_MANDIRI;
const linkLogin = env.LINK_LOGIN_MANDIRI;
//const linkLogin2 = env.LINK_LOGIN2_MANDIRI;

async function logout(browser,page){
  await page.goto(linkLogout, {waitUntil:"networkidle0", timeout:0});
  await browser.close();  
  if (browser && browser.process() != null) browser.process().kill('SIGINT');  
  console.log("Logout!");  
}

async function init(startDate, endDate, numberAccount=0){
  const chooseAccount = numberAccount;

  let data = [];

  let browser;

  console.log("Running");

  try {
    browser = await Handler.configureBrowser();    
  } catch (error) {
    console.log("Terjadi kesalahan pada Configure Browser!"); 
    return data;   
  }

  let page;

  try{
    page = await Handler.configurePage(browser, linkLogin);  
  }catch(error){
    console.log("Terjadi kesalahan pada Configure Page"); 
    return data;   
  }   

  console.log("Berhasil Load Login Page Mandiri " + linkLogin);

  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();    
  });

  try {
    console.log("Redirect Login Page!");
    await page.goto(linkLogout, {waitUntil:"networkidle0", timeout:0});
  } catch (error) {
    console.log("Terjadi kesalahan ketika redirect Login Page!");
    return data;
  }

  await page.waitForTimeout(2500);  

  try {
    await Handler.handlerInputCompanyID(page, account2[chooseAccount].companyId);
    await Handler.handlerInputUserName(page, account2[chooseAccount].userId);
    await Handler.handlerInputPassword(page, account2[chooseAccount].password);
  } catch (error) {    
    console.log("Terjadi kesalahan pada Handler Input CompanyID, UserID, Password");
    await logout(browser, page);        
    return data;
  }

  console.log(`Berhasil input CompanyID = ${account2[chooseAccount].companyId}, UserID = ${account2[chooseAccount].userId}, Password = ${account2[chooseAccount].password}`);

  try {
    console.log("Click Login Button!");
    await Handler.handlerClickLogin(page);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Click Login");
    await logout(browser, page);        
    return data;
  }  

  console.log("Berhasil masuk kedalam Dashboard!");

  console.log("Pending");

  await page.waitForTimeout(5000);

  try {
    console.log("Click Menu!");
    await Handler.handlerClickMenu(page);
  } catch (error) {
    console.log('Terjadi Kesalahan ketika Click Menu!');
    console.log("Kenaaa Session!!");
    await logout(browser, page);        
    return data;
  }

  console.log("Pending.. Load Page Filter Mutasi");

  await page.waitForTimeout(5000);

  try {
    console.log("Click Delete Parameter!");
    await Handler.handlerClickDeleteParam(page);
  } catch (error) {
    console.log("Terjadi Kesalahan ketika Delete Parameter!");
    await logout(browser, page);
    return data;
  }

  console.log("Success Delete Parameter Filter Tanggal!");
  
  await page.waitForTimeout(2500);

  try {
    console.log("Input Parameter StartDate, EndDate, Rekening!");
    await Handler.handlerAddStartDate(page, startDate);
    await Handler.handlerAddEndDate(page, endDate);
    await Handler.handlerAddRekening(page, account2[chooseAccount].rekening);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Input Parameter StartDate, EndDate, dan Rekening!");
    await logout(browser, page);
    return data;
  }

  try {
    console.log("Click Tampilkan Data!");
    await Handler.handlerClickShow(page);
  } catch (error) {
    console.log("Terjadi kesalahan ketika HandlerClick Show");
    await logout(browser, page);
    return data;
  }

  console.log("Pending..");

  await page.waitForTimeout(7500);

  try {
    console.log("Mencoba mengambil Data!");
    data = await Handler.handlerGetDataTable(page);
  } catch (error) {
    console.log("Terjadi Kesalahan ketika mengambil data pada table!");
    console.log(error);
    await logout(browser, page);
    return data;
  }

  await page.waitForTimeout(10000);

  await logout(browser, page);

  return data;

}

module.exports = {init};

