const env = require('dotenv')

env.config()

const express = require('express')
const http = require('http');
const cors = require('cors')

const app = express()

const { middleBank } = require('./src/middleware/rule');

app.use(express.json())
app.use(cors())

const { 
  configureBrowser, 
  configurePage, 
  closeBrowser, 
  inputText, 
  clickButton, 
  clickNavigation, 
  getObject, 
  getFrame, 
  clickNavigationWithFrame, 
  goto, 
  getLengthChildren, 
  getText 
} = require("./src/helper/index")()

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const createFormatDate = (date) => {
  if(String(date)?.length === 1){
    return `0${date}`
  }
  return date
}

const createFormatNumberFromDate = (data) => {
  const resultFormat = String(data)?.split("-")
  return {
    str:`${resultFormat[0]}${resultFormat[1]}${resultFormat[2]}`,
    arr:resultFormat
  }
}

app.post("/permata/cek", middleBank, async (req, res)=>{

  const data = req?.valid

  const startDate = createFormatNumberFromDate(data?.startDate)
  const endDate = createFormatNumberFromDate(data?.endDate)

  const browser = await configureBrowser()
  const page = await configurePage(browser, "https://www.permatae-business.com/corp/common/login.do?action=logout")

  //login

  await delay(5000)

  await inputText(`//*[@id="Table_01"]/tbody/tr[3]/td[3]/table/tbody/tr[3]/td/label/input`, data?.companyId, 150, page)

  await delay(5000)  

  await inputText(`//*[@id="Table_01"]/tbody/tr[3]/td[3]/table/tbody/tr[5]/td/input`, data?.userId, 150, page)

  await delay(5000)  

  await inputText(`//*[@id="pass"]`, data?.password, 150, page)

  await delay(5000)  

  await clickNavigation(`//*[@id="Table_01"]/tbody/tr[3]/td[3]/table/tbody/tr[10]/td/input[1]`, 1, page)

  await delay(5000)

  const frameMenu = getFrame("menuFrame", page)

  await delay(1000)

  await clickButton(`//*[@id="masterdiv"]/div[3]`, 1, frameMenu)

  await delay(1000)

  await clickButton(`//*[@id="subs15"]`, 1, frameMenu)

  await delay(1000)

  const frameMain = getFrame("mainFrame", page)

  await delay(1000)

  await clickButton(`/html/body/form/table[3]/tbody/tr[1]/td[2]/a[2]/img`, 1, frameMain)

  await delay(1000)

  await clickButton(`/html/body/form/table[3]/tbody/tr[2]/td[2]/a[2]/img`, 1, frameMain)

  await delay(1000)

  await inputText(`/html/body/form/table[3]/tbody/tr[1]/td[2]/input[4]`, startDate?.str, 500, frameMain)

  await delay(5000)

  await inputText(`/html/body/form/table[3]/tbody/tr[2]/td[2]/input[4]`, endDate?.str, 500, frameMain)
  
  await delay(5000)

  ///html/body/form/table[3]/tbody/tr[5]/td[2]/input[1]

  // await delay(5000)

  // await clickButton(`/html/body/form/table[4]/tbody/tr/td/input[1]`, 1, frameMain)

  await goto(`https://www.permatae-business.com/corp/front/transactioninquiry.do?action=getListTransactionByDate&accountNumber=${data?.rekening}&accountNm=${data?.rekeningName}&currDisplay=IDR&day1=${startDate?.arr[0]}&mon1=${startDate?.arr[1]}&year1=${startDate?.arr[2]}&day2=${endDate?.arr[0]}&mon2=${endDate?.arr[1]}&year2=${endDate?.arr[2]}&trxFilter=%`, page)

  await delay(5000)

  //viewHtmlFrame

  const frameView = getFrame("viewHtmlFrame", page)

  await delay(5000)

  const lengChildrenTbody = await getLengthChildren(`/html/body/table/tbody/tr/td[2]/a/table/tbody`, frameView)

  const listArr = []

  for(let i=1;i<=lengChildrenTbody;i++){
    const tmpLen = await getLengthChildren(`/html/body/table/tbody/tr/td[2]/a/table/tbody/tr[${i}]`, frameView)
    if(tmpLen === 12){
      const arr = []
      for(let j=2;j<12;j++){
        const text = await getText(`/html/body/table/tbody/tr/td[2]/a/table/tbody/tr[${i}]/td[${j}]/span`, frameView)
        arr.push(text)
      }    
      listArr.push(arr)
    }
  }  

  const len = listArr?.length

  const resList = []

  for(let u=1;u<len-1;u++){
    let obj = {
      tanggal : "",
      deskripsi : "",    
      debit : "",
      credit : ""
    }
    const dateFormat = new Date(listArr[u][1])
    obj.tanggal = `${dateFormat.getFullYear()}-${createFormatDate(dateFormat.getMonth()+1)}-${createFormatDate(dateFormat.getDate())}`
    
    obj.deskripsi = listArr[u][7]
    
    const regex = new RegExp(/,/,'g')

    const tmpDebit = parseInt(listArr[u][8].toString().replace(regex,""))
    const tmpCredit = parseInt(listArr[u][9].toString().replace(regex,""))

    obj.debit = tmpDebit
    obj.credit = tmpCredit

    resList.push(obj)
  }  

  //logout
  // await clickNavigationWithFrame(`//*[@id="masterdiv"]/div[14]/a`, 1, frameMenu, page)

  await goto(`https://www.permatae-business.com/corp/common/login.do?action=logout`, page)

  await delay(5000)

  await closeBrowser(browser)

  const resOb = {
    status : true,
    code : 200,
    message : "Robot cek mutasi Permata telah selesai dan telah berhasil logout serta close browser :)",
    total : resList?.length,
    data : resList
  }

  res.status(200).json(resOb)

})


app.post("/mandiri/cek", middleBank, async (req, res)=>{

  const data = req?.valid

  const browser = await configureBrowser()
  const page = await configurePage(browser, "https://mcm.bankmandiri.co.id/corp/common/login.do?action=logout")

  await delay(1000)

  await inputText(`/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/table/tbody/tr[1]/td[2]/input`, data?.companyId, 100, page)

  await delay(1000)  

  await inputText(`/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/table/tbody/tr[3]/td[2]/input`, data?.userId, 100, page)

  await delay(1000)  

  await inputText(`/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/table/tbody/tr[4]/td[2]/input[2]`, data?.password, 100, page)

  await delay(1000)  

  await clickNavigation(`//*[@id="button"]`, 1, page)

  await delay(1000)

  await clickButton(`//*[@id="masterdiv"]/div[2]/a`, 1, page)

  await delay(1000)

  await clickButton(`//*[@id="subs8"]`, 1, page)

  await delay(1000)

  await clickButton(`/html/body/form/table[3]/tbody/tr[1]/td[2]/a[2]/img`, 1, page)

  await delay(1000)

  await clickButton(`/html/body/form/table[3]/tbody/tr[2]/td[2]/a[2]/img`, 1, page)

  await delay(1000)

  await inputText(`/html/body/form/table[3]/tbody/tr[1]/td[2]/input[4]`, "01102021", 500, page)

  await delay(1000)

  await inputText(`/html/body/form/table[3]/tbody/tr[2]/td[2]/input[4]`, "18102021", 500, page)

  await delay(1000)

  await inputText(`/html/body/form/table[3]/tbody/tr[5]/td[2]/input[1]`, data?.rekening, 100, page)

  await delay(1000)
    
  await clickButton(`/html/body/form/table[3]/tbody/tr[5]/td[2]/a[1]/img`, 1, page)
  
  await delay(1000)

  await clickNavigation(`/html/body/table/tbody/tr/td/table[2]/tbody/tr/td/table/tbody/tr/td[4]/a`, 1, page)

  await closeBrowser(browser)

  res.status(200).json({message:"Berhasil"})  

})

app.post("/bri/cek", middleBank, async (req, res) => {

  const data = req?.valid

  const browser = await configureBrowser()
  const page = await configurePage(browser, "https://ibank.bri.co.id/cms/Logon.aspx")

  await clickButton(`//*[@id="TB_closeWindowButton"]`, 1, page)

  await delay(1000)

  await inputText(`//*[@id="ClientID"]`, data?.companyId, 100, page)

  await delay(1000)  

  await inputText(`//*[@id="UserID"]`, data?.userId, 100, page)

  await delay(1000)  

  await inputText(`//*[@id="Password"]`, data?.password, 100, page)

  await delay(1000)  

  await clickNavigation(`//*[@id="bLogin"]`, 1, page)

  await delay(1000)

  // await closeBrowser(browser)

  res.status(200).json({message:"Berhasil"})  

})

app.all("*", (_,res)=>{
  res.send({res:"Oppss yout wrong endpoint!"});
});
 
const server = http.createServer(app)

server.listen(process.env.PORT)
