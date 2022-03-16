// //addNewData(execute())}
// const re = RegExp('bear','gi')
// const matches = document.documentElement.innerHTML.match(re)

// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse){
//     //chrome.runtime.sendMessage('powinno dotrzeć bo już rozumiem')
//     chrome.runtime.sendMessage({
//         url: window.location.href,
//         count: matches.length
//     })
// })

var s = document.createElement('script');
s.src = chrome.runtime.getURL('functions.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);