const Handler = require("./controller/handler");

const env = require("../../../env");
const { account } = require("../../../config");

const linkLogin = env.LINK_LOGIN;
const linkMutasi = env.LINK_MUTASI;
const linkLogout = env.LINK_LOGOUT;

async function logout(browser,page){
  await page.goto(linkLogout, {waitUntil:"networkidle0", timeout:0});
  await browser.close();  
  if (browser && browser.process() != null) browser.process().kill('SIGINT');  
  console.log("Logout!");  
}

async function init(startDate, endDate, numberAccount=0){
  
  let data = [];

  const chooseAccount = numberAccount;  

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

  console.log("Berhasil Load Login Page BNI " + linkLogin);  

  try {
    await Handler.handlerInputCompanyID(page, account[chooseAccount].companyId);
    await Handler.handlerInputUserID(page, account[chooseAccount].userId);
    await Handler.handlerInputPassword(page, account[chooseAccount].password);     
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Input CompanyID, UserID, Password");
    await logout(browser, page);    
    
    return data;
  }

  console.log(`Berhasil input CompanyID = ${account[chooseAccount].companyId}, UserID = ${account[chooseAccount].userId}, Password = ${account[chooseAccount].password}`);

  try {    
    await Handler.handlerClickLogin(page);  
    console.log("Menuju Dashboard..");
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Click Login");
    await logout(browser, page);    
    
    return data;
  }
  
  console.log("Berhasil masuk kedalam Dashboard!");    

  console.log("Pending..");

  await page.waitForTimeout(5000);

  try {
    console.log("Persiapan masuk kedalam page Mutasi");
    await page.goto(linkMutasi, {waitUntil:"networkidle0", timeout:0});  
  } catch (error) {
    console.log("Terjadi kesalahan pada Proses Redirect menuju Mutasi Page!");
    await logout(browser, page);    
    
    return data;
  }

  console.log("Berhasil masuk kedalam Page Mutasi!");

  await page.waitForTimeout(7000);

  try {
    await Handler.handlerDeletePostingDate(page);
  } catch (error) {
    console.log("Terjadi Kesalahan ketika delete Parameter");
    console.log("Kenaaa Session!!");
    await logout(browser, page);    
    
    return data;
  }

  console.log("Berhasil menghapus parameter tanggal pada Page Mutasi");

  try {
    await Handler.handlerAddDateParameter(page, startDate, endDate, account[chooseAccount].rekening);
  } catch (error) {
    console.log("Terjadi Kesalahan Ketika Add Parameter Date And Rekening");
    await logout(browser, page);    
    
    return data;
  }

  console.log("Berhasil Memasukan Parameter yang dibutuhkan.");

  try {
    await Handler.handlerClickShowData(page);
  } catch (error) {
    console.log('Terjadi kesalahan pada Handler Click Show Data');
    await logout(browser, page);    
    
    return data;
  }  
  
  console.log("Berhasil Masuk pada Page Mutasi");

  await page.waitForTimeout(5000);

  try {
    console.log("Mencoba mengambil data pada Page Mutasi!");
    data = await Handler.handlerGetDataMutasi(page);
  } catch (error) {
    console.log("Terjadi kesalahan pada Handler Get Data Mutasi");
    console.log("Data Kosong");
    await logout(browser, page);  
    
    return data;
  }

  await page.waitForTimeout(5000);

  logout(browser, page); 

  
  
  return data;
  
}

module.exports = {init};


