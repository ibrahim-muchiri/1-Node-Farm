const fs = require("fs");
const http = require('http');
const url= require('url');


// const prod = fs.readFileSync('./product.txt', 'utf-8');
// console.log(prod);

// const prod = fs.readFile('./product.txt', 'utf-8');
// console.log(prod);

// const output = `This is what we know about: ${prod} invented on ${Date.now()}`;
// fs.writeFileSync('./product.txt', output);
// console.log('File written');

// fs.readFile('./product.txt', 'utf-8', (err, data)=>{
//     console.log(data);
// });

//Creating server
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = temp.replace(/{%IMAGE%}/g, product.image);
    output = temp.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = temp.replace(/{%QUANTITY%}/g, product.quantity);
    output = temp.replace(/{%ID%}/g, product.id);
    output = temp.replace(/{%DESCRIPTION%}/g, product.description);
    output = temp.replace(/{%FROM%}/g, product.from);
    output = temp.replace(/{%PRICE%}/g, product.price);
    
    if(!product.organic) output = temp.replace(/{%NOT_ORGANIC%}/g, product.not_organic);
    return output;
}


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/Dev-data/data.json`, 'utf-8');
    const dataObj = JSON.parse(data);


const server = http.createServer((req, res) =>{
    const pathName = req.url;

    //Overview page
    if(pathName === '/' || pathName === '/Overview'){
        res.writeHead(200, {'content-type': 'text/html'});

        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);

        res.end(output);
    }     

    //product page
    else if(pathName === '/product'){
        res.end('product page');
    }

    //API
   else if(pathName === '/api'){      
           res.writeHead(200, {'content-type': 'application/json'});
           res.end(data);
       }   
  

    //Not found page
    else{
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'Hello World'

        })
        res.end('<h1>Page not found</h1>');
        
    }
});

server.listen(3000, '127.0.0.1', () =>{
    console.log('server started on port 3000');
});

