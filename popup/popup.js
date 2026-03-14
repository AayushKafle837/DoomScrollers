// email
const emailIdElement = document.getElementById("emailId");

// Button
const confirmEmailButton = document.getElementById("confirmEmailButton");

confirmEmailButton.onclick = function(){
        const prefs = {
        emailId: emailIdElement.value
        }
        chrome.runtime.sendMessage({ event: 'onEmailConfirmed', prefs })

}

chrome.storage.local.get(["emailId"], (result) => {

    if (result.emailId){
        emailIdElement.value = result.emailId;
    }
})