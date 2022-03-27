document.addEventListener('DOMContentLoaded',function(){
    document.querySelector('#executeButton').addEventListener('click',function(){
        const userInput=document.querySelector("#userInput").value
        chrome.tabs.query({currentWindow: true, active: true},
        function (tabs){
            const tabId = tabs[0].id;
            chrome.scripting.executeScript(
            {
                target: {tabId: tabId},
                func: everything,
                args:[userInput]
            });    
        }) 
    }, false)

    document.querySelector('#closeButton').addEventListener('click',function(){
        chrome.tabs.query({currentWindow: true, active: true},
        function (tabs){
            const tabId = tabs[0].id;
            chrome.scripting.executeScript(
            {
                target: {tabId: tabId},
                func: deleteButton
            });    
        }) 
    }, false)
}, false)

function everything(actualUserInput)
{
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


    function execute(input){
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
        document.querySelectorAll(".fb-input__field.ml-5")[number-1].focus()
        document.querySelectorAll(".fb-input__field.ml-5")[number-1].select()
        return document.execCommand('insertText', false, priceBruttoFrom)
    }

    function setMultiplier(number, multiplier)
    {
        document.querySelectorAll(".fb-input__field")[7*(number-1)+1].focus()
        document.querySelectorAll(".fb-input__field")[7*(number-1)+1].select()
        return document.execCommand('insertText', false, multiplier)
    }

    function setToFixed(number, places)
    {
        document.querySelectorAll(".fb-input__field")[7*(number-1)+2].focus()
        document.querySelectorAll(".fb-input__field")[7*(number-1)+2].select()
        return document.execCommand('insertText', false, places)

    }

    function setRoundingto99(number)
    {
        return document.querySelectorAll(".fb-input__field")[7*(number-1)+5].value=true
    }

    function setAddedAmount(number, amount)
    {
        document.querySelectorAll(".fb-input__field")[7*(number-1)+6].focus()
        document.querySelectorAll(".fb-input__field")[7*(number-1)+6].select()
        return document.execCommand('insertText', false, amount)
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

        for(let i=1; i<=output.length; i++){
            expandRange(i)
            await wait()
            addSingleRange(i, output[i-1][0], output[i-1][1], 2, parseFloat(parseFloat(output[i-1][2]).toFixed(2)))

            if(i<output.length)
            {
                addNewRange()
            }
            await wait()
        }
    }

    addNewPriceList(actualUserInput)
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
