
// Requiring the module
const reader = require('xlsx')
  
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


function searchForValue(value)
{
    for(let adress of Object.keys(faktury.Sheets.Faktury))
    {
        if(faktury.Sheets.Faktury[adress].hasOwnProperty('v'))
        {
            if((faktury.Sheets.Faktury[adress].v).toString().includes(value))
            {
                return adress
            }
        }
    }

    return false
}

function rowSelection()
{
    
}

function searchForPrice(adress)
{
    if(faktury.Sheets.Faktury[adress].hasOwnProperty('v'))
    {
        if(!((faktury.Sheets.Faktury[adress].v).toString().toLowerCase()).includes('cena'))
        {
            let iterationToStart = parseInt(adress.slice(1))-1
            const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

            for(iterationToStart; iterationToStart>0; iterationToStart--)
            {
                let suspects=[]
                for(let letter of alphabet)
                {
                    if(faktury.Sheets.Faktury[letter+iterationToStart]!=undefined)
                    {
                        if(faktury.Sheets.Faktury[letter+iterationToStart].hasOwnProperty('v'))
                        {
                            if((faktury.Sheets.Faktury[letter+iterationToStart].v).toString().toLowerCase().includes('cena'))
                            {
                                if((faktury.Sheets.Faktury[letter+iterationToStart].v).toString().toLowerCase().includes('brutto'))
                                {
                                    suspects.push([letter, 'b'])
                                }
                                else
                                {
                                    suspects.push([letter, 'n'])
                                }
                            }
                        }
                    }
                    
                }

                if(suspects.length==1)
                {
                    if(suspects[0][1]!='b') return parseFloat(parseFloat(faktury.Sheets.Faktury[suspects[0][0]+adress.slice(1)].v).toFixed(2))
                    else return parseFloat((parseFloat(faktury.Sheets.Faktury[suspects[0][0]+adress.slice(1)].v)*0.77).toFixed(2))
                }
                else if(suspects.length>1)
                {
                    let suspectValues=[]
                    
                    for(let suspect of suspects)
                    {
                        suspectValues.push(faktury.Sheets.Faktury[suspect[0]+adress.slice(1)].v)
                    }
                    
                    let result = suspectValues[0]

                    for (let value of suspectValues) 
                    {
                        if (value < result) 
                        {
                            result = value
                        }
                    }

                    return result
                }
            }
        }
        else if(((faktury.Sheets.Faktury[adress].v).toString().toLowerCase()).includes('cena') && ((faktury.Sheets.Faktury[adress].v).toString().toLowerCase()).includes('ab spółka akcyjna'))
        {
            return extractProductNettoPrice(faktury.Sheets.Faktury[adress].v, 'AILAGA000000014')
        }
        else
        {
            return false
        }
    }
    else
    {
        return false
    }
}

function combinedSearch(product)
{
    let search = searchForValue(product.SKU) 

    if(search!=false)
    {
        price_netto = searchForPrice(search)
    }
    else
    {
        let search = searchForValue(product.EAN) 
        if(search!=false)
        {
            price_netto = searchForPrice(search)
        }
        else
        {
            let search = searchForValue(product['Nazwa produktu']) 
            if(search!=false)
            {
                price_netto = searchForPrice(search)
            }
            else
            {
                price_netto=false 
            }
        }
    }

    return price_netto
}

function executeTest()
{
    const products = getProductsArr()

    let productsCompleted=[] 

    for(let product of products)
    {
        let price_netto=combinedSearch(product)

        if(price_netto!=false)
        {
            price_netto=parseFloat(price_netto)
            product['Cena zakupu netto']=price_netto
            product['Cena zakupu brutto']=parseFloat(parseFloat(price_netto+price_netto*0.23).toFixed(2))
        }

        productsCompleted.push(product)
    }

    const ws = reader.utils.json_to_sheet(productsCompleted)
  
    reader.utils.book_append_sheet(produkty, ws ,"Produkty uzupełnione")
    reader.writeFile(produkty,'./Produkty.xlsx')
    console.log('ukończono')

}

function getAllEnterIndexes(cellString)
{
    let indexes = []
    
    for(let i = 0; i<cellString.length; i++)
    {
        if(cellString[i]=='\n')
        {
            indexes.push(i)
        }
    }

    return indexes
}

function extractProductNettoPrice(cellString, productInfo)
{
    let index=cellString.indexOf(productInfo)

    let enterIndexes=getAllEnterIndexes(cellString)

    let beginning = ''
    let end = ''
    for(let enter of enterIndexes)
    {
        if(enter < index)
        {
            beginning = enter + 1
        }
        else
        {
            end = enter
            break
        }
    }

    cellArr=cellString.slice(beginning, end).split(/\s\s+/g)
    cellArr=cellArr.filter(function(value, index, arr){ 
        return value != '';
    });
    

    return cellArr[3]
    
}

executeTest()