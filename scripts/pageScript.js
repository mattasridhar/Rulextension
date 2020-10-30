// Divs
const contentDiv = document.getElementById("content");
const squashCommitsContentDiv = document.getElementById("squashCommitsContent");
const settingsContentDiv = document.getElementById("settingsContent");
//CheckBox
const squashCommitsChk = document.getElementById("squashCommits");
// Inputs
const ruleInput = document.getElementById("rule");
const commitInput = document.getElementById("commitID");
const convoCommitInput = document.getElementById("convoCommitID");
// Buttons
const settingsBtn = document.getElementById("settingsBtn");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submit");
const updateBtn = document.getElementById("update");

// defaults
window.rule = "";
window.squashCommits = false;
window.commitID = "";
window.convoCommitID = "";

let response = { type: "", message: {} };

// Send the readyness of the Extension DOM and listen to the events
const extensionReady = () => {
  console.log("SRI Extension Ready: ");
  response.type = "extensionLoaded";
  response.message = {};
  // sendValueToContentScript(response);
  sendValueToBackgroundScript(response);
  captureExtensionEvents();
};

// Capture and handle the different events happening in the Popup UI
const captureExtensionEvents = () => {
  settingsBtn.addEventListener("click", () => {
    settingsBtn.style.display = "none";
    contentDiv.style.display = "none";
    squashCommitsContentDiv.style.display = "none";
    settingsContentDiv.style.display = "block";
  });

  backBtn.addEventListener("click", () => {
    settingsBtn.style.display = "block";
    contentDiv.style.display = "flex";
    squashCommitsContentDiv.style.display = "flex";
    settingsContentDiv.style.display = "none";
  });

  submitBtn.addEventListener("click", () => {
    const ruleValue = ruleInput.value;
    const chkStatus = squashCommitsChk.checked;

    // send value to background only if value has altered
    if (rule !== ruleValue || squashCommits !== chkStatus) {
      response.type = "ruleUpdated";
      response.message = {
        rule: ruleValue,
        squashCommits: chkStatus,
      };
      sendValueToBackgroundScript(response);
    }
  });

  updateBtn.addEventListener("click", () => {
    const commitIDValue = commitInput.value;
    const convoCommitIDValue = convoCommitInput.value;

    // send value to background only if value has altered
    if (commitID !== commitIDValue || convoCommitID !== convoCommitIDValue) {
      response.type = "commitIDUpdated";
      response.message = {
        commitID: commitIDValue,
        convoCommitID: convoCommitIDValue,
      };
      sendValueToBackgroundScript(response);
    }
  });
};

// For handling the sending and receiving of the background messages
const sendValueToBackgroundScript = (respToBg) => {
  // Sending and waiting for response from Background
  chrome.runtime.sendMessage(respToBg, function (response) {
    // Listening to response from background Script
    handleResponseFromBackground(response);
  });
};

// Handle th response received from the background script
const handleResponseFromBackground = (backgroundResponse) => {
  switch (backgroundResponse.type) {
    case "bgDefaults":
      if (backgroundResponse.message.rule !== rule) {
        rule = backgroundResponse.message.rule;
      }
      if (backgroundResponse.message.squashCommits !== squashCommits) {
        squashCommits = backgroundResponse.message.squashCommits;
      }
      if (backgroundResponse.message.commitID !== commitID) {
        commitID = backgroundResponse.message.commitID;
      }
      if (backgroundResponse.message.convoCommitID !== convoCommitID) {
        convoCommitID = backgroundResponse.message.convoCommitID;
      }
      setDefaultValues();
      break;
    case "defaultsUpdated":
      rule = backgroundResponse.message.rule;
      squashCommits = backgroundResponse.message.squashCommits;
      response.type = "ruleUpdated";
      response.message = {
        rule,
        squashCommits,
      };
      // send the updated values to content script
      sendValueToContentScript(response);
      break;
    case "defaultsCommitIDUpdated":
      commitID = backgroundResponse.message.commitID;
      response.type = "commitIDUpdated";
      response.message = {
        commitID,
        convoCommitID,
      };
      // send the updated values to content script
      sendValueToContentScript(response);
      break;
    default:
      break;
  }
};

// set the default values
const setDefaultValues = () => {
  if (rule !== "") {
    ruleInput.value = rule;
  }
  squashCommitsChk.checked = squashCommits;
  if (commitID !== "") {
    commitInput.value = commitID;
  }
  if (convoCommitID !== "") {
    convoCommitInput.value = convoCommitID;
  }
};

// For sending updated values to content script
const sendValueToContentScript = (respToContent) => {
  const params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, respToContent);
  });
};

document.addEventListener("DOMContentLoaded", extensionReady, false);
