var fs = require('fs');
var cheerio = require('cheerio');
var base64 = require('base-64');
const express = require('express')
const puppeteer = require('puppeteer')
const app = express();
const bodyParser = require('body-parser');

let port = process.env.PORT || 3000;
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var request = require('request-promise');

var username = 'lum-customer-hl_0354ff9e-zone-static';

var password = 'o65s13jhqhb7';
var port_p = 22225;
var user_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
var session_id = (1000000 * Math.random())|0;
var super_proxy = 'http://'+username+'-session-'+session_id+':'+password+'@zproxy.lum-superproxy.io:'+port_p;

const devices = require('./devices');


let scrape = async(query) =>{
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    // let pages = await browser.pages();
    const page = await browser.newPage();
    
    await page.goto('https://mobile.willhaben.at/gebrauchtwagen/auto/gebrauchtwagenboerse/'+query);
    await page.waitFor(1000);
    
    // await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let elements = document.querySelectorAll('.search-result-entry');
         // Select all Products
        console.log(elements);
        for (let element of elements){ 
            // console.log()
            // // Loop through each proudct
            let url = element.childNodes[1].childNodes[1].href;
            url = url.replace('https', 'http');
            let img_url = element.childNodes[1].childNodes[1].childNodes[1].src; 
            let name = element.childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[0].textContent; 
            let info = element.childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[0].textContent; 
            let price = element.childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[4].childNodes[1].childNodes[0].textContent;// Select the title
            info = info.replace(/\n|\r/g, "");
            test = info.split("|");
            if(test.length > 1){
                let milage = test[1].trim();
                let age = test[0].trim();
                data.push({url, name, img_url, age, milage, price});
            }else{
                data.push({url, name, img_url, info, price});
            }
            
            // // let price = element.childNodes[7].children[0].innerText; // Select the price
            // let url_article = container.section.a['href']
            // let img_url = container.img['src']
            // let article_name = container.findAll("div", {"class":"heading-container"})[0].a.span.text
             // Push an object with the data onto our array
        }
        

        return data; // Return our data array
    });
    // let data = [];
    // for (let index = 0; index < result.length; index++) {
        
    //     let contactResponse = await single(result[index]['url']);
    //     data.push({
    //         url: result[index]['url'],
    //         img_url: result[index]['img_url'],
    //         price: result[index]['price'],
    //         phone: contactResponse,
    //     });
    // }

    browser.close();
    return result;
};

app.get('/', (req, res) => {
    var query = '?page='+req.query.page+'&DEALER='+req.query.DEALER+'&PRICE_FROM='+req.query.PRICE_FROM+'&PRICE_TO='+req.query.PRICE_TO;
    scrape(query).then((value) => {
        res.send(value)       
    })

})


app.post('/single', function(req, res) {
    var url = req.body.url;

    var options = {
        url: url,
        proxy: super_proxy,
        transform: function (body) {
            return cheerio.load(body);
        },
        headers: {'User-Agent': user_agent},
    };

    request(options)
    .then(function(data){ 

    let scripts = data('script');
    let scriptToDecode='';
    
    scriptToDecode = scripts.get()[scripts.length-2].children[0].data;
    // Finds BaseDecode
    var re = /\('[A-Za-z0-9+=/._]*'\)/g;
    // Only Base64
    var re_v = /[A-Za-z0-9+=/._]*/g;
    var newtext = scriptToDecode.match(re);
    var base64EncodedHtml = newtext[0].replace(/\(|\)|'/g,'');
    var table_html = base64.decode(base64EncodedHtml);
    var $ = cheerio.load(table_html);
    var contact = {
        'telefon':$('.tracking_phoneNumber').get()[0].children[0].data
    }
    res.send(contact);
 }, function(err){ console.error(err); });
    
});




app.listen(port, () =>{ 
    console.log(devices.length);
    console.log('Example app listening on port '+port+'!')})

// single('https://mobile.willhaben.at/gebrauchtwagen/d/auto/skoda-octavia-skoda-octavia-combi-mit-neuer-kupplung-bremsen-263323237/?sid=1533912326541').then((value)=>{
//     console.log(value)
// });

// const puppeteer = require('puppeteer');
// const VIN_SELECTOR = '#page > div > div.pane-content-constrain > main > div > div > div > div > section.side > aside > p.extra-info > span:nth-child(3)';

// let vins = [];

// async function run() {
//   let browser = await puppeteer.launch({
//     headless: false
//   });

//   let pages = await browser.pages();

//   await pages[0].goto('https://tesla.com/used');

//   let carHandles = await pages[0].$$('.vehicle-link');

//   for (let i = 0; i < carHandles.length; i++) {
//     await pages[0].waitForSelector('.vehicle-link');
//     carHandles[i].click();
//   }
//   console.log('Finished clicking.');

//   let count = 0;

//   while (count < carHandles.length) {
//     pages = await browser.pages();
//     count = pages.length;
//   }

//   for (let i = 1; i < carHandles.length; i++) {
//     let vin = await pages[i].evaluate((sel) => {
//       return document.querySelector(sel).innerHTML;
//     }, VIN_SELECTOR);

//     vins.push(vin);
//     await pages[i].close();
//   }

//   for (let i = 0; i < vins.length; i++) {
//     console.log(`${i + 1}: ${vins[i]}`);
//   }

//   browser.close();
// }
// run();