import { State } from "./model/state.ts";

const inputField = document.getElementById("input-field") as HTMLInputElement;
const form = document.getElementById("form") as HTMLFormElement;

const tabGroupsList = document.getElementById(
  "tab-groups-list"
) as HTMLDivElement;

function render(state: State): string {
  return state.filteredTabGroups.map((g) => `<p>${g.displayName}</p>`).join("");
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

form.addEventListener("submit", (async) => {
  if (state.activeTabId) {
    chrome.tabs.group({
      tabIds: [state.activeTabId],
      groupId: 928363216,
    });
  }
});

export {};
