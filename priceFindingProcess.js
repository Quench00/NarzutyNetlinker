
// Requiring the module
const reader = require('xlsx')
  
// Reading our test file
const produkty = reader.readFile('./Produkty.xlsx')
const faktury = reader.readFile('./Faktury.xlsx')


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

function createExcelElongatedAlphabet()
{
    
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    let elongatedAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    for(let letter1 of alphabet)
    {
        for(let letter2 of alphabet)
        {
            elongatedAlphabet.push(letter1+letter2)
        }
    }

    return elongatedAlphabet
}

function searchForPrice(adress)
{
    if(faktury.Sheets.Faktury[adress].hasOwnProperty('v'))
    {
        if(!((faktury.Sheets.Faktury[adress].v).toString().toLowerCase()).includes('cena'))
        {
            let iterationToStart = parseInt(adress.replace(/\D/g,''))-1
            const alphabet = createExcelElongatedAlphabet()

            for(iterationToStart; iterationToStart>0; iterationToStart--)
            {
                let suspects=[]

                for(let i=alphabet.length-1; i>=0; i--)
                {
                    let letter=alphabet[i]
                    if(faktury.Sheets.Faktury.hasOwnProperty(letter+iterationToStart))
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
                    else
                    {
                        //break;
                    }
                    
                }

                if(suspects.length==1)
                {
                    if(faktury.Sheets.Faktury.hasOwnProperty(suspects[0][0]+adress.replace(/\D/g,'')))
                    {
                        
                        if(suspects[0][1]!='b' && faktury.Sheets.Faktury[suspects[0][0]+adress.replace(/\D/g,'')].hasOwnProperty('v')) return parseFloat(parseFloat(faktury.Sheets.Faktury[suspects[0][0]+adress.replace(/\D/g,'')].v).toFixed(2))
                        else if(faktury.Sheets.Faktury[suspects[0][0]+adress.replace(/\D/g,'')].hasOwnProperty('v')) return parseFloat((parseFloat(faktury.Sheets.Faktury[suspects[0][0]+adress.replace(/\D/g,'')].v)*0.77).toFixed(2))
                        else return 'nie znaleziono'
                    }
                    
                }
                else if(suspects.length>1)
                {
                    let suspectValues=[]
                    
                    for(let suspect of suspects)
                    {
                        if(faktury.Sheets.Faktury.hasOwnProperty(suspect[0]+adress.replace(/\D/g,'')))
                        {
                            if(faktury.Sheets.Faktury[suspect[0]+adress.replace(/\D/g,'')].hasOwnProperty('v'))
                            {
                                suspectValues.push(faktury.Sheets.Faktury[suspect[0]+adress.replace(/\D/g,'')].v)
                            }
                        }
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

function executeForProduct(product)
{
    let price_netto=combinedSearch(product)

    if(price_netto!=false)
    {
        price_netto=parseFloat(price_netto)
        product['Cena zakupu netto']=price_netto
        product['Cena zakupu brutto']=parseFloat(parseFloat(price_netto+price_netto*0.23).toFixed(2))
    }

    return product
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


module.exports = executeForProduct