console.log("SRI in pageScript");
// Divs
const contentDiv = document.getElementById("content");
const mergeContentDiv = document.getElementById("mergeContent");
const settingsContentDiv = document.getElementById("settingsContent");
//CheckBox
const mergeChk = document.getElementById("merge");
// Inputs
const ruleInput = document.getElementById("rule");
const commitInput = document.getElementById("commitID");
// Buttons
const settingsBtn = document.getElementById("settingsBtn");
const updateBtn = document.getElementById("update");

// defaults
window.rule = "";
window.merge = false;
window.commitID = "";

let response = { type: "", message: {} };

// Send the readyness of the Extension DOM and listen to the events
const extensionReady = () => {
  console.log("SRI Extension Ready: ");
  // sendValueToBackgroundScript(`extensionLoaded`);
  sendValueToContentScript(`SRIDHAR`);
  captureExtensionEvents();
};

const captureExtensionEvents = () => {
  settingsBtn.addEventListener("click", () => {
    console.log("SRI settingsClickd: ");
    settingsBtn.style.display = "none";
    contentDiv.style.display = "none";
    mergeContentDiv.style.display = "none";
    settingsContentDiv.style.display = "flex";
  });

  updateBtn.addEventListener("click", () => {
    console.log("SRI updateClickd: ");
    settingsBtn.style.display = "block";
    contentDiv.style.display = "flex";
    mergeContentDiv.style.display = "flex";
    settingsContentDiv.style.display = "none";

    // sendValueToContentScript(inputValue.value);
    // sendValueToBackgroundScript(selectedCountry.value);
  });
};

// For handling the sending and receiving of the background messages
const sendValueToBackgroundScript = (type, inputValue) => {
  console.log("SRI sending value to BackgroundScript: ", inputValue);
  let pageContent = {
    type,
    message: inputValue,
  };
  // Sending and waiting for response from Background
  chrome.runtime.sendMessage(pageContent, function (response) {
    // Listening to response from background Script
    handleResponseFromBackground(response);
  });
};

const handleResponseFromBackground = (backgroundResponse) => {
  console.log("SRI in handleBgResp: ", backgroundResponse);
  switch (backgroundResponse.type) {
    case "extensionLoaded":
      response.type = msg.type;
      response.message = {
        rule: window.rule,
        merge: window.merge,
        commitID: window.commitID,
      };
      break;
    default:
      break;
  }
};

const sendValueToContentScript = (inputValue) => {
  console.log("SRI sending value to ContentScript: ", inputValue);
  const params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, (tabs) => {
    let pageContent = {
      message: inputValue,
    };
    chrome.tabs.sendMessage(tabs[0].id, pageContent);
  });
};

document.addEventListener("DOMContentLoaded", extensionReady, false);
