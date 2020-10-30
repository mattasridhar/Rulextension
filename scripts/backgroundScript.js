console.log("SRI in background");

// defaults
window.rule = "";
window.merge = false;
window.commitID = "js-commits-list-item";

let response = { type: "", message: {} };

// Perform actions only when the Extension is clicked
chrome.browserAction.onClicked.addListener((tab) => {
  console.log("SRI Extension Clicked!");
  let backgroundContent = {
    message: "SRIDHAR",
  };
  chrome.tabs.sendMessage(tab.id, backgroundContent); //send the message to the content script
});

// Listen to messages coming from Extension page
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  handleMsgFromOtherScripts(msg, sendResponse);
});

const handleMsgFromOtherScripts = (msg, sendResponse) => {
  console.log("SRI in bg onMsg: ", msg);

  switch (msg.type) {
    case "extensionLoaded":
    case "pageLoaded":
      response.type = "bgDefaults";
      response.message = {
        rule: window.rule,
        merge: window.merge,
        commitID: window.commitID,
      };
      sendResponse(response);
      break;
    default:
      sendResponse({ countryNames, countryCodes });
      break;
  }
};
