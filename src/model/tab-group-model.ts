export class TabGroupViewModel {
  constructor(private tabGroup: chrome.tabGroups.TabGroup) {}

  get displayName(): string {
    if (this.tabGroup.title) {
      return this.tabGroup.title;
    }
    return this.tabGroup.id + " (untitled)";
  }

  toHtml(): string {
    return `<p>${this.displayName}</p>`;
  }
}
