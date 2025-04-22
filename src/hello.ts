const echoSpan = document.getElementById("echo-span") as HTMLSpanElement;
const inputField = document.getElementById("input-field") as HTMLInputElement;
const form = document.getElementById("form") as HTMLFormElement;

const tabGroupsList = document.getElementById(
  "tab-groups-list"
) as HTMLDivElement;

class TabGroup {
  constructor(readonly title: string, readonly id: number) {}

  get displayName(): string {
    if (this.title) {
      return this.title;
    }

    return "" + this.id;
  }

  toHtml(): string {
    return `<p>${this.displayName}</p>`;
  }

  static fromResponse(model: chrome.tabGroups.TabGroup) {
    return new TabGroup(model.title ?? "", model.id);
  }
}

function renderTabGroups(tabGroups: TabGroup[], prefix: string): string {
  prefix = prefix.toLowerCase();
  return tabGroups
    .filter((group) => group.displayName.toLowerCase().startsWith(prefix))
    .map((group) => group.toHtml())
    .join("");
}

const tabGroupsResponse = await chrome.tabGroups.query({});
const tabGroups = tabGroupsResponse.map((model) =>
  TabGroup.fromResponse(model)
);

tabGroupsList.innerHTML = renderTabGroups(tabGroups, "");

inputField.addEventListener("input", (event) => {
  echoSpan.innerText = inputField.value;
  tabGroupsList.innerHTML = renderTabGroups(tabGroups, inputField.value);
});

form.addEventListener("submit", async (event) => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);

  console.log("HERE!");
  if (tab?.id) {
    chrome.tabs.group({
      tabIds: [tab?.id],
      groupId: 928363216,
    });
  }
});

export {};
