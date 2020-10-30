// defaults
window.rule = "";
window.squashCommits = false;
window.commitID = "";
window.convoCommitID = "";

let response = { type: "", message: {} };

// Content Loaded
const pageLoaded = () => {
  sendValueToBackgroundScript(`pageLoaded`);
};

// For handling the sending and receiving of the background messages
const sendValueToBackgroundScript = (type, inputValue) => {
  let messageContent = {
    type,
    message: inputValue,
  };
  // Sending and waiting for response from Background
  chrome.runtime.sendMessage(messageContent, function (response) {
    // Listening to response from background Script
    handleMsgFromOtherScripts(response);
  });
};

// handle the response received from PopUp script and background script
const handleMsgFromOtherScripts = (responseToHandle) => {
  switch (responseToHandle.type) {
    case "bgDefaults":
      crossCheckWithDefaults(responseToHandle.message);
      break;
    case "commitIDUpdated":
    case "ruleUpdated":
      location.reload();
      crossCheckWithDefaults(responseToHandle.message);
      break;
    default:
      break;
  }
};

// store defaults if they are different
const crossCheckWithDefaults = (defaults) => {
  if (defaults.rule !== rule) {
    rule = defaults.rule;
  }
  if (defaults.squashCommits !== squashCommits) {
    squashCommits = defaults.squashCommits;
  }
  if (defaults.commitID !== commitID) {
    commitID = defaults.commitID;
  }
  if (defaults.convoCommitID !== convoCommitID) {
    convoCommitID = defaults.convoCommitID;
  }
  modifyPageUI();
};

// check Page contents for the rules and take the action
const modifyPageUI = () => {
  const commitLiElements = document.getElementsByClassName(commitID);
  [...commitLiElements].forEach((liElement) => {
    const commitAElements = liElement.getElementsByTagName("a");
    [...commitAElements].forEach((aElement) => {
      const labelContent = aElement.getAttribute("aria-label");
      const commitMsg = aElement.innerHTML;
      if (labelContent && commitMsg) {
        if (
          (labelContent.includes(commitMsg) ||
            commitMsg.includes(labelContent)) &&
          !commitMsg.toLowerCase().includes(rule.toLowerCase())
        ) {
          liElement.style.border = "thick solid #FF0000";
        }
      }
    });
  });

  const commitDivElements = document.getElementsByClassName(convoCommitID);
  [...commitDivElements].forEach((divElement) => {
    const commitAElements = divElement.getElementsByTagName("a");
    [...commitAElements].forEach((aElement) => {
      const labelContent = aElement.getAttribute("title");
      const commitMsg = aElement.innerHTML;

      if (labelContent && commitMsg) {
        if (
          (labelContent.includes(commitMsg) ||
            commitMsg.includes(labelContent)) &&
          !commitMsg.toLowerCase().includes(rule.toLowerCase())
        ) {
          divElement.style.border = "thick solid #FF0000";
        }
      }
    });
  });

  const mergeArea = document.getElementsByClassName("merge-message")[0];
  if (squashCommits && mergeArea) {
    mergeArea.style.border = "thick solid #FC9003";
    mergeArea.style.background = "#FFD875";
  }
};

// perform action only when the extension is clicked and the desired message is obtained from backgroundScript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMsgFromOtherScripts(request);
});

document.addEventListener("readystatechange", pageLoaded, true);
document.addEventListener("load", pageLoaded, true);
