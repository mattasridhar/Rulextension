// defaults
window.rule = "Update";
window.squashCommits = true;
window.commitID = "js-commits-list-item";
window.convoCommitID = "js-commit";

let response = { type: "", message: {} };

// Listen to messages coming from Extension page
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
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
        convoCommitID,
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
      if (msg.message.convoCommitID !== convoCommitID) {
        convoCommitID = msg.message.convoCommitID;
      }
      response.type = "defaultsCommitIDUpdated";
      response.message = {
        commitID,
        convoCommitID,
      };
      sendResponse(response);
      break;
    default:
      break;
  }
};
