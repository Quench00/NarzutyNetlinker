function splitNewLines(str)
{
    str = str.split(/\r?\n/);
    return str;
}

function prepareString(str)
{
    str = str.replaceAll("zł","");
    str = str.replaceAll(" ","");
    str = str.replace(/\s\s+/g, ' ');
    str = str.replaceAll('\t', ' ');
    str = str.replaceAll(',', '.');
    let strings=str.split(" ");

    for(let i=0; i<strings.length; i++){
    if(strings[i]=="") strings.splice(i,1);
    }


    return strings;
}


function execute(){
let result=splitNewLines(input);

for(let i=0; i<result.length; i++)
    {
    result[i]=prepareString(result[i]);
        for(let z=0; z<result[i].length; z++)
        {
            if(result[i][z].includes(' '))
            {
                result[i][z]=result[i][z].replaceAll(' ','');
            }
        }
    }

return result;
}


function deleteButton()
{
    function collapseFirstRange()
    {
        return document.querySelectorAll("i.tree-arrow.has-child.ltr")[0].click()
    }

    function deleteRange(number)
    {
        return document.querySelectorAll("i.icon.icon-cross.ml-10.cl-red")[number-1].click()
    }

    function getNumberOfRangesToDelete()
    {
        return document.querySelectorAll("i.icon.icon-cross.ml-10.cl-red").length 
    }

    async function wait()
    {
        return new Promise(resolve => {setTimeout(resolve, 5)})
    }

    async function deleteOldData()
    {
        const numberOfRangesToDelete=getNumberOfRangesToDelete()

        for(let range=numberOfRangesToDelete; range>=0; range--)
        {
            deleteRange(range)
            await wait()
        }

        collapseFirstRange()
    }

    deleteOldData()

}

function expandRange(number)
{
    return document.querySelectorAll("i.tree-arrow.has-child.ltr")[number-1].click()
}

function addNewRange()
{
    return document.querySelectorAll("button.btn.mt-15.mb-30.has-wave")[1].click()
}

function setPriceBruttoFrom(number, priceBruttoFrom)
{
    return document.querySelectorAll("input.fb-input__field.ml-5")[number-1].value=priceBruttoFrom
}

function setMultiplier(number, multiplier)
{
    return document.querySelectorAll("input.fb-input__field")[number].value=multiplier
}

function setToFixed(number, places)
{
    return document.querySelectorAll("input.fb-input__field")[number+1].value=places
}

function setRoundingto99(number)
{
    return document.querySelectorAll("select.fb-input__field")[number+1].value=true
}

function setAddedAmount(number, amount)
{
    return document.querySelectorAll("input.fb-input__field")[number+2].value=amount
}

function addSingleRange(number, priceBruttoFrom, multiplier, places, amount)
{
    setPriceBruttoFrom(number, priceBruttoFrom)
    setMultiplier(number, multiplier)
    setToFixed(number, places)
    setRoundingto99(number)
    setAddedAmount(number, amount)
}

async function wait()
{
return new Promise(resolve => {setTimeout(resolve, 5)})
}

async function addNewPriceList(userInput)
{
    const output=execute(userInput)
    let number=output.length;

    for(let range of output){
        expandRange(i)
        addSingleRange(i, output[i][0], output[i][1], 2, output[i][2])

        if(i<number-1)
        {
            addNewRange()
        }
        await wait()
    }
}


//module.exports=addNewPriceList