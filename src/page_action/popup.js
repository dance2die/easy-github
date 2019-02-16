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

const forkSyncEl = document.getElementById("fork_sync");
const forkSyncURLEl = document.getElementById("url_fork_sync");

const localPREl = document.getElementById("local_pr");
const localPRURLEl = document.getElementById("url_local_pr");

chrome.tabs.query(
  { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
  function(tabs) {
    const { id: tabId } = tabs[0].url;
    // http://infoheap.com/chrome-extension-tutorial-access-dom/

    // const forkUrlCode = `document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]')`;
    // const urlCode = `document.querySelector('meta[name="go-import"]').content.split(' ')[0]])`;

    // Try to get
    // 1. fork parent URL
    // 2. URL from metadata
    const code = `(function getUrls(){
      const forkUrl = document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]') 
        ? document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]').content
        : undefined;

      const url = document.querySelector('meta[name="go-import"]') 
        ? document.querySelector('meta[name="go-import"]').content.split(' ')[0]
        : undefined;

      return { forkUrl, url };
    })()`;

    chrome.tabs.executeScript(tabId, { code }, function(result) {
      const { forkUrl, url } = result[0];

      if (forkUrl) {
        forkSyncURLEl.innerText = `
          git remote add upstream https://github.com/${forkUrl}
          git fetch upstream
          git branch --set-upstream-to=upstream/master master`;
      } else if (url) {
        forkSyncURLEl.innerText = `
          git remote add upstream https://${url}
          git fetch upstream
          git branch --set-upstream-to=upstream/master master`;
      } else {
        forkSyncEl.innerHTML = `<pre>Nothing to sync here</pre>`;
      }

      // document.getElementById("url_fork_sync").innerText = `result=${JSON.stringify(
      //   result
      // )}`;
    });

    // chrome.storage.sync.get("url_fork_sync", function(url) {
    //   document.getElementById("url_fork_sync").innerText = `
    //   git remote add upstream ${url}
    //   git fetch upstream
    //   git branch --set-upstream-to=upstream/master master`;
    // });

    const extractCopyText = text =>
      text
        .split("\n")
        // Get rid of new lines
        .filter(_ => _.replace(/\s+/g, ""))
        .map(c => c.trim())
        .join("\n");

    const copyToClipboard = code =>
      navigator.clipboard
        .writeText(code)
        .then(() => alert("Copied to clipboard~"))
        .catch(() => alert("Failed to copy to clipboard..."));

    document.getElementById("copy_fork_sync").addEventListener("click", e => {
      const code = extractCopyText(forkSyncURLEl.innerText);
      copyToClipboard(code);
    });

    document.getElementById("copy_local_pr").addEventListener("click", e => {
      const code = extractCopyText(localPRURLEl.innerText);
      copyToClipboard(code);
    });
  }
);

// chrome.storage.sync.get("url_fork_sync", function(url) {
//   console.log(`url`, url);
//   document.getElementById("url_fork_sync").innerText = url;
// });
