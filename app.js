// var phantom = require('phantom');

// phantom.create(function (ph) {
//   ph.createPage(function (page) {
//     var url = "http://www.bdtong.co.kr/index.php?c_category=C02";
//     page.open(url, function() {
//       page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
//         page.evaluate(function() {
//           $('.listMain > li').each(function () {
//             console.log($(this).find('a').attr('href'));
//           });
//         }, function(){
//           ph.exit()
//         });
//       });
//     });
//   });
// });

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://mobile.willhaben.at/gebrauchtwagen/auto/gebrauchtwagenboerse/');
  const textContent = await page.evaluate(() => {
    const cheerio = require('cheerio')
      
    const $ = cheerio.load(document)
      
    return $
  });

  console.log(textContent); /* No Problem Mate */

  browser.close();
})();


// const express = require('express')
// const app = express();
// const https = require('https');
// var fs = require('fs');

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const dom = new JSDOM(``, { 
//     url:'https://mobile.willhaben.at/gebrauchtwagen/auto/gebrauchtwagenboerse',
//     runScripts: "dangerously" });
// // let $ = cheerio.load('https://mobile.willhaben.at/gebrauchtwagen/auto/gebrauchtwagenboerse');
// fs.writeFile("texty.txt", dom.window.document.querySelector("article").textContent, function(err) {
//                 if(err) {
//                     return console.log(err);
//                 }

//                 console.log("The file was saved!");
//             }); 

// let articles = [];
// let article = {
//     name:'',
//     name:'',
//     name:'',
//     name:'',
//     name:'',
// }

// app.get('/', (req, res) => {
//     console.log(req.query.PRICE_TO);
//     https.get('https://mobile.willhaben.at/gebrauchtwagen/auto/gebrauchtwagenboerse?PRICE_TO='+req.query.PRICE_TO, (resp) => {
//       let data = '';
    
//       // A chunk of data has been recieved.
//       resp.on('data', (chunk) => {
//         data += chunk;
//       });

//       // The whole response has been received. Print out the result.
//         // const mm = /(<article class="search-result-entry  ">)[a-zA-Z0-9\n<>:/"=./ -×ÄäÖöÜüẞß}{)(]*(<\/article>)/gi;
//       resp.on('end', () => {
//         var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
//         while (SCRIPT_REGEX.test(data)) {
//             data = data.replace(SCRIPT_REGEX, "");
//         }
//         data = data.replace('<!DOCTYPE html>', "");
//         var soup = new JSSoup(data);
//         var articlesHTML = soup.findAll('article');
//         articles = articlesHTML.map((one)=>{
//                 let article = {
//                     url: 'https://mobile.willhaben.at/'+one.nextElement.nextElement.attrs.href,
//                     img: one.nextElement.nextElement.nextElement.attrs.src,
//                     name: one.nextElement.nextSibling.nextElement.nextElement.nextElement.nextElement._text,
//                     info: one.nextElement.nextSibling.nextElement.nextSibling.nextElement.nextElement.nextElement.nextElement._text,
//                     // price: scrapePage('https://mobile.willhaben.at/'+one.nextElement.nextElement.attrs.href),
//                 }
//                 return article;
//             });
//             res.send(articles)
//             // fs.writeFile("texty.txt", data, function(err) {
//             //     if(err) {
//             //         return console.log(err);
//             //     }

//             //     console.log("The file was saved!");
//             // }); 
//           });

//         }).on("error", (err) => {
//           console.log("Error: " + err.message);
//         });
// });




// async function scrapePage(url){
//     var https = require('https');
  
//     return await https.get(url, (resp) => {
//             return 'a';
//           let data = '';
//           // A chunk of data has been recieved.
//           resp.on('data', (chunk) => {
//             data += chunk;
//           });

//           // The whole response has been received. Print out the result.
//             // const mm = /(<article class="search-result-entry  ">)[a-zA-Z0-9\n<>:/"=./ -×ÄäÖöÜüẞß}{)(]*(<\/article>)/gi;
//           resp.on('end', () => {
//             var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
//             while (SCRIPT_REGEX.test(data)) {
//                 data = data.replace(SCRIPT_REGEX, "");
//             }
//             data = data.replace('<!DOCTYPE html>', "");
//             return data;
//             var soup = new JSSoup(data);
//             var articlesHTML = soup.findAll('table');
//             return articlesHTML;
//           });

//         }).on("error", (err) => {
//           console.log("Error: " + err.message);
//         });
// }

// app.listen(3000, () => console.log('Example app listening on port 3000!'))