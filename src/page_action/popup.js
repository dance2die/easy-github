// chrome.storage.sync.get("forSyncCode", function(url) {
//   document.getElementById("forSyncCode").innerText = `
//   git remote add upstream ${url}
//   git fetch upstream
//   git branch --set-upstream-to=upstream/master master`;
// });

// chrome.storage.sync.get("forSyncCode", function(url) {
//   console.log(`url`, url);
//   document.getElementById("forSyncCode").innerText = url;
// });

// const forkSyncContainer = document.getElementById("forkSync");
// const localPRContainer = document.getElementById("localPR");

const forkSync = document.getElementById("forSyncCode");
const localPR = document.getElementById("localPRCode");

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

document.getElementById("copyForkSyncButton").addEventListener("click", _ => {
  const code = extractCopyText(forkSync.innerText);
  copyToClipboard(code);
});

document.getElementById("copyLocalPRButton").addEventListener("click", _ => {
  const code = extractCopyText(localPR.innerText);
  copyToClipboard(code);
});

chrome.tabs.query(
  { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
  function(tabs) {
    const { id: tabId } = tabs[0].url;

    setupForkSync(tabId);
    setupLocalPR(tabId);
  }
);

function setupForkSync(tabId) {
  // @TODO: use "octolytics-dimension-repository_is_fork" to check if repo is a fork later
  const code = `(function getUrls(){
      const forkUrl = document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]') 
        ? document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]').content
        : undefined;

      const url = document.querySelector('meta[name="go-import"]') 
        ? document.querySelector('meta[name="go-import"]').content.split(' ')[0]
        : undefined;

      return { forkUrl, url };
    })()`;

  // http://infoheap.com/chrome-extension-tutorial-access-dom/
  chrome.tabs.executeScript(tabId, { code }, function(result) {
    const { forkUrl, url } = result[0];

    if (forkUrl) {
      forkSync.innerText = `git remote add upstream https://github.com/${forkUrl}
git fetch upstream
git branch --set-upstream-to=upstream/master master`;
    } else if (url) {
      forkSync.innerText = `git remote add upstream https://${url}
git fetch upstream
git branch --set-upstream-to=upstream/master master`;
    } else {
      forkSync.innerText = `Nothing to do here - Not a Forked Repo`;
      copyForkSyncButton.style.visibility = "hidden";
    }

    // forkSync.innerText = JSON.stringify(result);
  });
}

function setupLocalPR(tabId) {
  // <meta property="og:url" content="https://github.com/dance2die/calendar-dates/pull/62">
  const code = `(function getPRId() {
    const url = document.querySelector('meta[property="og:url"]')
      ? document.querySelector('meta[property="og:url"]').content
      : undefined;
    const tokens = url.split("/");
    const prId = tokens[tokens.length - 1];

    return url ? prId : undefined;
  })()`;

  chrome.tabs.executeScript(tabId, { code }, function(result) {
    const prId = result[0];

    const isPR = !isNaN(parseInt(prId));

    chrome.storage.sync.get("branchName", function({ branchName }) {
      // // @ToDo: Get this from user's preference
      // const branchName = "BRANCHNAME";

      if (isPR) {
        localPR.innerText = `git fetch origin pull/${prId}/head:${branchName}
git checkout ${branchName}`;
      } else {
        localPR.innerText = `Nothing to do here - Not a Pull Request page`;
        copyLocalPRButton.style.visibility = "hidden";
      }
    });
  });
}
