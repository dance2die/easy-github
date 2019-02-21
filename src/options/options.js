const defaultBranchName = "DEFAULT_BRANCHNAME2";

function handleOptions() {
  const saveButton = document.getElementById("saveButton");

  saveButton.addEventListener("click", function() {
    const branchName =
      document.getElementById("branchName").value || defaultBranchName;
    chrome.storage.sync.set({ branchName }, function() {
      alert(branchName);
      const message = `set the branch name to ${branchName}`;
      console.log(message);
      alert(message);
    });
  });
}

handleOptions();
