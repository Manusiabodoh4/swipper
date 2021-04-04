const Handler = require("./controller/handler");

const env = require("../../../env");
const {account4} = require("../../../config");

const linkLogin = env.LINK_LOGIN_BRI;
const linkMain = env.LINK_MAIN_BRI;

async function logout(browser, page){
  console.log("Menuju Main Menu!");
  await page.goto(linkMain, {waitUntil:"networkidle0", timeout:0});  
  await page.waitForTimeout(5000);
  try {    
    console.log('Click Logout Button!');
    await Handler.handlerClickLogOut(page);
  } catch (error) {
    console.log(error);
  }
  await browser.close();  
  if (browser && browser.process() != null) browser.process().kill('SIGINT');  
  console.log("Logout!");  
}

async function init(startDate, endDate, numberAccount=0){

  let data = [];

  let browser;

  try {
    console.log("Running");
    browser = await Handler.configureBrowser();    
  } catch (error) {
    console.log("Terjadi kesalahan pada Configure Browser!");
    return data;
  }

  console.log('Berhasil Configure Browser');

  let page;

  try {
    console.log("Configure Page!");
    page = await Handler.configurePage(browser, linkLogin);
  } catch (error) {
    console.log("Terjadi kesalahan pada Configure Page!");    
    browser.close();
    return data;
  }

  console.log('Berhasil Configure Page');

  try {
    console.log("Menutup Pengumuman Dialog, Jika ada!");
    await Handler.handlerExitPengumuman(page);
  } catch (error) {
    console.log("Terjadi kesalahan pada Saat menutup Dialog Pengumuman!");
    browser.close();
    return data;
  }

  console.log("Berhasil Menutup Pengumuman Dialog!");

  try {
    console.log("Memasukan CompanyID, UserID, dan Password!");    
    await Handler.handlerInputCompanyID(page, account4[numberAccount].companyId);
    await Handler.handlerInputUserID(page, account4[numberAccount].userId);
    await Handler.handlerInputPassword(page, account4[numberAccount].password);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Input CompanyID, UserID, Password");    
    browser.close();
    return data;
  }

  try {
    console.log("Click Login Button!");
    await Handler.handlerClickLogin(page);
  } catch (error) {
    console.log("Terjadi Kesalahan pada Handler Click Login!");
    browser.close();
    return data;
  }

  console.log("Menuju Dashboard Page...");

  console.log("Pending..");

  await page.waitForTimeout(5000);

  console.log("Load Dashboard Page!");

  try {
    console.log("Click Account Information menu top");
    await Handler.handlerClickAccountInformation(page);
  } catch (error) { 
    console.log("Terjadi kesalahan pada Handler Click Account Information");
    await logout(browser, page);
    return data;
  }

  console.log("Berhasil Click Menu Account Information");

  await page.waitForTimeout(2500);

  try {
    console.log("Click Menu Side Account Information");
    await Handler.handlerClickAccountInformationSide(page);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler CLick Menu Side Account Information");
    await logout(browser, page);
    return data;
  }

  console.log("Berhasil click menu side Account Information");

  await page.waitForTimeout(1500);

  try {
    console.log("Click Menu Side Account Statement");
    await Handler.handlerClickAccountStatement(page);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Click Account Statement!");
    await logout(browser, page);
    return data;
  }

  console.log("Berhasil Click menu side Account Statement");
  
  await page.waitForTimeout(5000);

  try {
    console.log("Input Seluruh Parameter yang di butuhkan");
    await Handler.handlerInputRekening(page, account4[numberAccount].rekening);
    await Handler.handlerInputStartDate(page, startDate);
    await Handler.handlerInputEndDate(page, endDate);
  } catch (error) {
    console.log("Terjadi Kesalahan pada Saat Input Parameter Data Mutasi!");
    console.log(error);
    await logout(browser, page);
    return data;
  }

  console.log("Berhasil Memasukan Parameter yang dibutuhkan.");

  await page.waitForTimeout(1500);

  try {
    console.log("Click Submit Mutasi Table Data!");
    await Handler.handlerClickGetData(page);
  } catch (error) {
    console.log("Terjadi kesalahan ketika click submit button");
    await logout(browser, page);
    return data;
  }

  console.log("Berhasil menampilkan table data mutasi!");  

  await page.waitForTimeout(30000);

  try {
    console.log("Mencoba mendapatkan Content Frame Data Mutasi");
    await Handler.handlerLoadContentPageTableData(page);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Content Frame!");    
    await logout(browser, page);
    return data;
  }  

  await page.waitForTimeout(10000);

  try {
    console.log("Mencoba mendapatkan data frame content!");
    data = await Handler.handlerGetDataFromContentFrameMutasi(page);    
  } catch (error) {
    console.log("Terjadi kesalahan ketika mencoba mendapatkan data frame content!");
    console.log(error);
    await logout(browser, page);
    return data;
  }

  await logout(browser, page);

  return data;

}

module.exports = {init};