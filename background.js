chrome.runtime.onMessage.addListener(data => {
    switch (data.event) {
        case 'onEmailConfirmed':
            handleOnEmailConfirmed(data);
            break;
        default:
            break;

    }
})

const handleOnEmailConfirmed = function(data){
    console.log("prefs recieved: ", data.prefs.emailId);
    chrome.storage.local.set(data.prefs);
}


// This function is called whenever a new webpage is loaded. 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {


});