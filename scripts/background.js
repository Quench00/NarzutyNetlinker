window.bears={}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    window.bears[request.url]=request.count
    // chrome.tabs.query({currentWindow: true, active: true},
    //     function (tabs){
    //         chrome.tabs.executeScript(tabs[0].id, {code: "alert('hello!');"});
    //     })
})

chrome.browserAction.onClicked.addListener(function (tab){
    chrome.tabs.create({url:'popup.html'})
})