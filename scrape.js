const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
let port = process.env.PORT || 3000;
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const single =  async(url)=>{
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    // let pages = await browser.pages();
    
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitFor(1000);
    // await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let elements = document.querySelectorAll('.contactList');
         // Select all Products
        console.log(elements);
            
            var rows = elements[0].rows;
            
            for (let index = 0; index < rows.length; index++) {
                
                if(rows[index].cells[0].innerText == "Telefon"){
                    data.push({
                        'telefon':rows[index].cells[1].innerText.replace(/\n|\r/g, "") 
                    })
                }
            }
            
        

        return data[0]; // Return our data array
    });
    browser.close();
    return result;
};


let scrape = async() =>{
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    // let pages = await browser.pages();
    const page = await browser.newPage();

    await page.goto('https://mobile.willhaben.at/gebrauchtwagen/auto/gebrauchtwagenboerse/');
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
            let img_url = element.childNodes[1].childNodes[1].childNodes[1].src; 
            let name = elements[0].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[0].textContent; 
            let info = elements[0].childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[0].textContent; 
            let price = element.childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[4].childNodes[1].childNodes[0].textContent;// Select the title
            info = info.replace(/\n|\r/g, "");
            test = info.split("|");
            let milage = test[1].trim();
            let age = test[0].trim();
            // // let price = element.childNodes[7].children[0].innerText; // Select the price
            // let url_article = container.section.a['href']
            // let img_url = container.img['src']
            // let article_name = container.findAll("div", {"class":"heading-container"})[0].a.span.text
            data.push({url, name, img_url, age, milage, price}); // Push an object with the data onto our array
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

    scrape().then((value) => {
        res.send( value)       
    })

})


app.post('/single', function(req, res) {
    var url = req.body.url;
    single(url).then((value)=>{
        res.send(value);

    });
    
});



app.listen(port, () => console.log('Example app listening on port 3000!'))

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