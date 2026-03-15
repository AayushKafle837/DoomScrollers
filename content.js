console.log("content.js loaded on:", window.location.href);

const nsfwWords = [
    "porn",
    "xxx",
    "nude",
    "sex",
    "explicit",
    "nsfw",
    "adult",
    "erotic"
];

function scanPage() {
    try {
        const bodyText = document.body ? document.body.innerText.toLowerCase() : "";
        console.log("Scanning page text length:", bodyText.length);

        const matchedWords = nsfwWords.filter(word => bodyText.includes(word));
        console.log("Matched words:", matchedWords);

        if (matchedWords.length > 0) {
            alert("⚠️ Warning: Unsafe content detected on this webpage.");

            chrome.runtime.sendMessage(
                {
                    event: "sendGuardianAlert",
                    siteUrl: window.location.href,
                    decision: "BLOCK",
                    reason: "NSFW words detected on page",
                    flaggedWords: matchedWords.join(", ")
                },
                (response) => {
                    console.log("Background response:", response);

                    if (chrome.runtime.lastError) {
                        console.error("Runtime error:", chrome.runtime.lastError.message);
                    }
                }
            );
        }
    } catch (error) {
        console.error("scanPage error:", error);
    }
}

window.addEventListener("load", () => {
    console.log("Window loaded, starting scan...");
    setTimeout(scanPage, 1500);
});