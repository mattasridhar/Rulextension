// defaults
window.rule = "";
window.merge = false;
window.commitID = "";

let response = { type: "", message: {} };

// Content Loaded
const pageLoaded = () => {
  console.log("SRIDHAR");
  sendValueToBackgroundScript(`pageLoaded`);
};

// For handling the sending and receiving of the background messages
const sendValueToBackgroundScript = (type, inputValue) => {
  // console.log("SRI sending value to BackgroundScript: ", inputValue);
  let messageContent = {
    type,
    message: inputValue,
  };
  // Sending and waiting for response from Background
  chrome.runtime.sendMessage(messageContent, function (response) {
    // Listening to response from background Script
    handleResponseFromBackground(response);
  });
};

const handleResponseFromBackground = (backgroundResponse) => {
  console.log("SRI contentResp frm BG: ", backgroundResponse);
  switch (backgroundResponse.type) {
    case "bgDefaults":
      crossCheckWithDefaults(backgroundResponse.message);
      break;
    default:
      break;
  }
};

// store defaults
const crossCheckWithDefaults = (defaults) => {
  rule = defaults.rule;
  merge = defaults.merge;
  commitID = defaults.commitID;
  handlePageContents();
};

// check Page contents for the rules and take the action
const handlePageContents = () => {
  const commitDivs = document.querySelectorAll("li");
  console.log("SRI commitDivs: ", commitDivs);
};

// perform action only when the extension is clicked and the desired message is obtained from backgroundScript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("SRI request in content: ", request);
  if (request !== null && request.message === "SRIDHAR") {
    let paras = document.getElementsByTagName("p");
    for (para of paras) {
      para.style["background-color"] = "#900223";
      para.innerHTML = request.message;
    }

    //replacing images for FUN
    let imgs = document.getElementsByTagName("img");
    for (img of imgs) {
      img.src = chrome.extension.getURL("assets/logo512.png");
    }
  }
});

document.addEventListener("readystatechange", pageLoaded, false);
