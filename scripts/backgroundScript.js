// defaults
window.rule = "Update";
window.squashCommits = true;
window.commitID = "commit-title";

let response = { type: "", message: {} };

// Listen to messages coming from Extension page
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    handleMsgFromOtherScripts(msg, sendResponse);
});

// Handle the response from popup script and content script based on their 'type'
const handleMsgFromOtherScripts = (msg, sendResponse) => {
    switch (msg.type) {
        case "extensionLoaded":
        case "pageLoaded":
            response.type = "bgDefaults";
            response.message = {
                rule,
                squashCommits,
                commitID,
            };
            sendResponse(response);
            break;
        case "ruleUpdated":
            if (msg.message.rule !== rule) {
                rule = msg.message.rule;
            }
            if (msg.message.squashCommits !== squashCommits) {
                squashCommits = msg.message.squashCommits;
            }
            response.type = "defaultsUpdated";
            response.message = {
                rule,
                squashCommits,
            };
            sendResponse(response);
            break;
        case "commitIDUpdated":
            if (msg.message.commitID !== commitID) {
                commitID = msg.message.commitID;
            }
            response.type = "defaultsCommitIDUpdated";
            response.message = {
                commitID,
            };
            sendResponse(response);
            break;
        default:
            sendResponse({ countryNames, countryCodes });
            break;
    }
};