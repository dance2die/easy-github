// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute("value", data.color);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     chrome.tabs.executeScript(tabs[0].id, {
//       code: `document.body.style.backgroundColor = "${color}";`
//     });
//   });
// };

// chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
//   var url = tabs[0].url;
//   console.log(`url`, url);
// });

// chrome.tabs.query(
//   { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
//   function(tabs) {
//     console.log(`tabs`, tabs);
//   }
// );

chrome.tabs.query(
  { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
  function(tabs) {
    const { id: tabId } = tabs[0].url;

    // chrome.storage.sync.set({ url }, function() {});
    // document.getElementById("url").innerText = url;

    // document.getElementById("url").innerText = document
    //   .querySelector('meta[name="go-import"]')
    //   .content.split(" ")[0];

    chrome.tabs.executeScript(
      tabId,
      {
        code: `document.querySelector('meta[name="go-import"]').content.split(' ')[0]`
      },
      function(url) {
        document.getElementById("url").innerText = `
        git remote add upstream ${url}
        git fetch upstream
        git branch --set-upstream-to=upstream/master master`;
      }
    );

    // chrome.storage.sync.get("url", function(url) {
    //   document.getElementById("url").innerText = `
    //   git remote add upstream ${url}
    //   git fetch upstream
    //   git branch --set-upstream-to=upstream/master master`;
    // });
  }
);

// chrome.storage.sync.get("url", function(url) {
//   console.log(`url`, url);
//   document.getElementById("url").innerText = url;
// });
