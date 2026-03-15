const EMAILJS_SERVICE_ID = "service_vaxr6k9";
const EMAILJS_TEMPLATE_ID = "template_u5a8nk4";
const EMAILJS_PUBLIC_KEY = "oUtjCGInCECM9cJhZ"; 

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    switch (data.event) {
        case "onEmailConfirmed":
            handleOnEmailConfirmed(data)
                .then(() => sendResponse({ success: true }))
                .catch((error) =>
                    sendResponse({ success: false, error: error.message })
                );
            return true;

        case "sendGuardianAlert":
            handleSendGuardianAlert(data)
                .then((result) => sendResponse({ success: true, result }))
                .catch((error) =>
                    sendResponse({ success: false, error: error.message })
                );
            return true;

        default:
            break;
    }
});

const handleOnEmailConfirmed = async function (data) {
    console.log("prefs received:", data.prefs.emailId);

    await chrome.storage.local.set({
        emailId: data.prefs.emailId
    });
};

const handleSendGuardianAlert = async function (data) {
    const stored = await chrome.storage.local.get(["emailId"]);
    const guardianEmail = stored.emailId;

    if (!guardianEmail) {
        throw new Error("No guardian email stored.");
    }

    const templateParams = {
        to_email: guardianEmail,
        site_url: data.siteUrl || "Unknown website",
        decision: data.decision || "BLOCK",
        reason: data.reason || "Unsafe content detected",
        flagged_words: data.flaggedWords || "None"
    };

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: templateParams
        })
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(`EmailJS failed: ${response.status} ${responseText}`);
    }

    console.log("Guardian email sent successfully:", responseText);
    return { sent: true };
};

// This function is called whenever a new webpage is loaded.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        console.log("Tab finished loading:", tab.url);

        // Temporary test trigger:
        // Uncomment this block ONLY for testing email on page load.

        /*
        chrome.runtime.sendMessage(
            {
                event: "sendGuardianAlert",
                siteUrl: tab.url,
                decision: "BLOCK",
                reason: "Test trigger on page load",
                flaggedWords: "test"
            },
            (response) => {
                console.log("Auto test email:", response);
            }
        );
        */
    }
});
