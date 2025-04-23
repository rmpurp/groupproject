import { State } from "./model/state.ts";

const inputField = document.getElementById("input-field") as HTMLInputElement;
const form = document.getElementById("form") as HTMLFormElement;

const tabGroupsList = document.getElementById(
  "tab-groups-list"
) as HTMLDivElement;

function render(state: State): string {
  return state.sortedTabGroups.map((g) => `<button class="tab-group-button ${g.isTopMatch ? "top-match" : ""} ${g.matchesSelection ? "" : "non-match"}">${g.displayName}</button>`).join("");
}

const tabGroups = await chrome.tabGroups.query({});
console.log(tabGroups.length);
let queryOptions = { active: true, lastFocusedWindow: true };
let [activeTab] = await chrome.tabs.query(queryOptions);

const state = new State(tabGroups, activeTab);

tabGroupsList.innerHTML = render(state);

inputField.addEventListener("input", (async) => {
  state.fieldText = inputField.value;

  tabGroupsList.innerHTML = render(state);
});

function moveToGroup(tabId: number, groupId: number) {
  chrome.tabs.group({
    tabIds: [tabId],
    groupId: groupId,
  });
}

form.addEventListener("submit", (async) => {
  const topTabGroup = state.topTabGroup?.tabGroupId;
  if (state.activeTabId && topTabGroup) {
    moveToGroup(state.activeTabId, topTabGroup);
    window.close();
  }
});

export { };
