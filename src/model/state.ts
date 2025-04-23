import { TabGroupViewModel } from "./tab-group-model.ts";

export class State {
  constructor(
    private tabGroups: chrome.tabGroups.TabGroup[],
    private activeTab: chrome.tabs.Tab | undefined,
    public fieldText: string = ""
  ) {}

  public get filteredTabGroups(): TabGroupViewModel[] {
    const text = this.fieldText.toLowerCase();
    return this.tabGroups
      .map((g) => new TabGroupViewModel(g))
      .filter((g) => g.displayName.toLowerCase().startsWith(text));
  }

  public get activeTabId(): number | undefined {
    return this.activeTab?.id;
  }
}
