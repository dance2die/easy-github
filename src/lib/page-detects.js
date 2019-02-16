// From refined-github
// https://github.com/sindresorhus/refined-github/blob/master/source/libs/page-detect.ts

export const isRepo = () =>
  /^[^/]+\/[^/]+/.test(getCleanPathname()) &&
  !isReserved(getOwnerAndRepo().ownerName) &&
  !isNotifications() &&
  !isDashboard() &&
  !isGist() &&
  !isRepoSearch();

export const getCleanPathname = () =>
  location.pathname.replace(/^[/]|[/]$/g, "");

export const getRepoPath = () => {
  if (isRepo()) {
    return getCleanPathname()
      .split("/")
      .slice(2)
      .join("/");
  }

  return undefined;
};

export const isPR = () => /^pull\/\d+/.test(getRepoPath());
