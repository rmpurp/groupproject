export class TabGroupViewModel {
  constructor(
    private tabGroup: chrome.tabGroups.TabGroup,
    readonly matchesSelection: boolean,
    public isTopMatch: boolean,
  ) {}

  get displayName(): string {
    if (this.tabGroup.title) {
      return this.tabGroup.title;
    }
    return this.tabGroup.id + " (untitled)";
  }

  get tabGroupId(): number {
    return this.tabGroup.id;
  }

  get classes(): string {
    const classes = ["tab-group-button"];
    if (this.isTopMatch) {
      classes.push("top-match");
    }

    if (!this.matchesSelection) {
      classes.push("non-match");
    }

    return classes.join(" ");
  }
}
