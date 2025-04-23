import { TabGroupViewModel } from "./tab-group-view-model.ts";

export class State {
  constructor(
    private tabGroups: chrome.tabGroups.TabGroup[],
    private activeTab: chrome.tabs.Tab | undefined,
    public fieldText: string = "",
  ) { }

  public get sortedTabGroups(): TabGroupViewModel[] {
    const text = this.fieldText.toLowerCase();

    const matchingTabGroups = this.tabGroups
      .map((g, i) => new TabGroupViewModel(g, true, false))
      .filter((g) => g.displayName.toLowerCase().startsWith(text));

    const nonMatchingTabGroups = this.tabGroups
      .map((g) => new TabGroupViewModel(g, false, false))
      .filter((g) => !g.displayName.toLowerCase().startsWith(text));

    const concatenated = [...matchingTabGroups, ...nonMatchingTabGroups];
    if (concatenated.length > 0) {
      concatenated[0].isTopMatch = true;
    }

    return concatenated
  }

  public get topTabGroup(): TabGroupViewModel | undefined {
    return this.sortedTabGroups[0];
  }

  public get activeTabId(): number | undefined {
    return this.activeTab?.id;
  }

  public get offerToCreateNewGroup(): boolean {
    return !!this.fieldText && (this.sortedTabGroups.length === 0 || !this.sortedTabGroups[0].matchesSelection);
  }
}
