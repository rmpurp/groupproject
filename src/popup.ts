import { State } from "./model/state";

const inputField = document.getElementById("input-field") as HTMLInputElement;
const form = document.getElementById("form") as HTMLFormElement;

const tabGroupsList = document.getElementById(
  "tab-groups-list"
) as HTMLDivElement;

function render(state: State): string {
  let newGroupButton = "";
  if (state.offerToCreateNewGroup) {
    newGroupButton = `<button class="tab-group-button top-match">${state.fieldText} (new group)</button>`
  }
  return newGroupButton + state.sortedTabGroups.map((g) => `<button class="tab-group-button ${g.isTopMatch ? "top-match" : ""} ${g.matchesSelection ? "" : "non-match"}">${g.displayName}</button>`).join("");
}

const tabGroups = await chrome.tabGroups.query({});
console.log(tabGroups.length);
let queryOptions = { active: true, lastFocusedWindow: true };
let [activeTab] = await chrome.tabs.query(queryOptions);

const state = new State(tabGroups, activeTab);

tabGroupsList.innerHTML = render(state);

inputField.addEventListener("input", () => {
  state.fieldText = inputField.value;

  tabGroupsList.innerHTML = render(state);
});

async function moveToGroup(tabId: number, groupId?: number): Promise<number> {
  return await chrome.tabs.group({
    tabIds: [tabId],
    groupId: groupId,
  });
}

form.addEventListener("submit", async () => {
  if (state.activeTabId) {
    if (state.offerToCreateNewGroup) {
      const group = await moveToGroup(state.activeTabId);
      chrome.tabGroups.update(group, { title: state.fieldText })
    } else {
      const topTabGroup = state.topTabGroup?.tabGroupId;
      if (topTabGroup) {
        await moveToGroup(state.activeTabId, topTabGroup);
      }
    }
  }

  window.close();
});

export { };
