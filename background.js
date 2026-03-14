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
    console.log("prefs recieved: ", data.prefs);
    chrome.storage.local.set(data.prefs);
}