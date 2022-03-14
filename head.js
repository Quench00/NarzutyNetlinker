const executeForProduct = require('./priceFindingProcess')
const fs = require('fs')
const reader = require('xlsx')
const produkty = reader.readFile('./Produkty.xlsx')
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

const stream = fs.createWriteStream("./produkty.txt");


function getProductsArr()
{
    let data=[]
    const sheets = produkty.SheetNames  
    for(let i = 0; i < sheets.length; i++)
    {
       const temp = reader.utils.sheet_to_json(
            produkty.Sheets[produkty.SheetNames[i]])
       temp.forEach((res) => {
          data.push(res)
       })
    }
    return data
}


function allProductsExecute()
{
    
    const products=getProductsArr()
    
    stream.once('open', async function(fd) {
        let iteration=1
        for(let product of products)
        {
          executeForProduct(product)
          const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
          stream.write(JSON.stringify(product))
          console.log('Wyszukano '+iteration+' z '+products.length+' produktów')
          iteration++
        }
        stream.end();
        console.log('gotowe!')
      });
}

allProductsExecute()