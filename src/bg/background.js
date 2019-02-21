// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// //example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log(`request, sender, sendResponse`);
//   chrome.pageAction.show(sender.tab.id);
//   sendResponse();
// });

// https://developer.chrome.com/extensions/getstarted
chrome.runtime.onInstalled.addListener(function() {
  // chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
  //   var url = tabs[0].url;
  //   console.log(`tabs`, tabs);
  // });
  // chrome.tabs.query(
  //   { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
  //   function(tabs) {
  //     console.log(`tabs`, tabs);
  //   }
  // );
  // chrome.storage.sync.set({ color: "#3aa757" }, function() {
  //   console.log("The color is green.");
  // });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "github.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);

    // Set the Branch name to use
    const defaultBranchName = "DEFAULT_BRANCHNAME";
    const isEmptyObject = target =>
      Object.keys(target).length === 0 && target.constructor === Object;
    chrome.storage.sync.get("branchName", function(branchName) {
      if (!isEmptyObject(branchName)) return;

      chrome.storage.sync.set({ branchName: defaultBranchName }, function() {
        console.log(`set the branch name to ${branchName}`);
      });
    });

    // chrome.tabs.query(
    //   { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    //   function(tabs) {
    //     // const url = document
    //     //   .querySelector('meta[name="go-import"]')
    //     //   .content.split(" ")[0];
    //     // console.log(`go-import`, url);
    //     // // chrome.storage.sync.set({ url: tabs[0].url }, function() {});

    //     chrome.tabs.executeScript(
    //       tabs[0].id,
    //       {
    //         code: `document.querySelector('meta[name="go-import"]').content.split(' ')[0]`
    //       },
    //       function(url) {
    //         chrome.storage.sync.set({ url }, function() {});
    //       }
    //     );
    //   }
    // );
  });
});
