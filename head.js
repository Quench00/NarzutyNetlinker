// Requiring the module
const reader = require('xlsx')
const executeForProduct = require('./priceFindingProcess')
const priceFindingProcess=require('./priceFindingProcess')
  
// Reading our test file
const produkty = reader.readFile('./Produkty.xlsx')
const faktury = reader.readFile('./Faktury.xlsx')

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

function executeTest()
{
    const products = getProductsArr()

    let productsCompleted=[] 
    let iteration=1
    let notFound=[]
    for(let product of products)
    {
        product=executeForProduct(product)
        if(isNaN(product['Cena zakupu netto']))
        {
            notFound.push(product)
        }
        productsCompleted.push(product)
        console.log('Dodano '+iteration+'/'+products.length +' produktów.')
        iteration++
    }

    const ws = reader.utils.json_to_sheet(productsCompleted)
  
    reader.utils.book_append_sheet(produkty, ws ,"Produkty uzupełnione")
    reader.writeFile(produkty,'./Produkty.xlsx')
    console.log('ukończono')
    console.log('liczba nieznalezionych: '+ notFound.length + '. Stopień sukcesu: '+ parseFloat(((products.length-notFound.length)/products.length*100).toFixed(2)))

}

executeTest()


