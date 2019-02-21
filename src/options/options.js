const defaultBranchName = "DEFAULT_BRANCHNAME2";

const isEmptyObject = target =>
  Object.keys(target).length === 0 && target.constructor === Object;

function handleOptions() {
  const saveButton = document.getElementById("saveButton");
  const branchNameEl = document.getElementById("branchName");

  chrome.storage.sync.get("branchName", function({ branchName }) {
    if (isEmptyObject(branchName)) return;

    branchNameEl.value = branchName;
  });

  saveButton.addEventListener("click", function() {
    const branchName = branchNameEl.value || defaultBranchName;
    chrome.storage.sync.set({ branchName }, function() {
      alert(`Branch name is set to "${branchName}"`);
    });
  });
}

handleOptions();
