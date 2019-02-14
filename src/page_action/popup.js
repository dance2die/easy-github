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

    // http://infoheap.com/chrome-extension-tutorial-access-dom/

    // const forkUrlCode = `document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]')`;
    // const urlCode = `document.querySelector('meta[name="go-import"]').content.split(' ')[0]])`;

    // Try to get
    // 1. fork parent URL
    // 2. URL from metadata
    // 3. last resort - current URL
    const code = `(function getUrls(){
      const forkUrl = document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]') 
        ? document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]').content
        : undefined;

      const url = document.querySelector('meta[name="go-import"]') 
        ? document.querySelector('meta[name="go-import"]').content.split(' ')[0]
        : undefined;

      const href = window.location.href;

      return { forkUrl, url, href };
    })()`;

    chrome.tabs.executeScript(tabId, { code }, function(result) {
      const { forkUrl, url, href } = result[0];
      const urlEl = document.getElementById("url");
      const forkSyncEl = document.getElementById("fork_sync");

      if (forkUrl) {
        urlEl.innerText = `
          git remote add upstream https://github.com/${forkUrl}
          git fetch upstream
          git branch --set-upstream-to=upstream/master master`;
      } else if (url) {
        urlEl.innerText = `
          git remote add upstream https://${url}
          git fetch upstream
          git branch --set-upstream-to=upstream/master master`;
      } else {
        forkSyncEl.innerText = `Nothing to sync here`;
        // git remote add upstream ${href}
        // git fetch upstream
        // git branch --set-upstream-to=upstream/master master`;

        // forkSyncEl.style.display = "none";
      }

      // document.getElementById("url").innerText = `result=${JSON.stringify(
      //   result
      // )}`;
    });

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
