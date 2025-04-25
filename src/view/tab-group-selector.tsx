import { act, useEffect, useRef, useState } from "react";
import { TabGroupViewModel } from "../model/tab-group-view-model";
import { State as AppViewModel } from "../model/state";
import { TabGroupList } from "./tab-group-list";

export const TabGroupSelector = () => {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | undefined>(
    undefined,
  );
  const [fieldText, setFieldText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const fetchedTabGroups = await chrome.tabGroups.query({});
      setTabGroups(fetchedTabGroups);
    };
    // TODO: add error handling
    loadData().catch();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      let queryOptions = { active: true, lastFocusedWindow: true };
      let [activeTab] = await chrome.tabs.query(queryOptions);
      setActiveTab(activeTab);
    };
    // TODO: add error handling
    loadData().catch();
  });

  const moveToGroup = async (
    tabId: number,
    groupId?: number,
  ): Promise<number> => {
    return await chrome.tabs.group({ tabIds: [tabId], groupId: groupId });
  };

  const viewModel = new AppViewModel(tabGroups, activeTab, fieldText);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent page refresh

    if (viewModel.offerToCreateNewGroup) {
      const groupId = await moveToGroup(viewModel.activeTabId!, undefined);

      await chrome.tabGroups.update(groupId, { title: viewModel.fieldText });
    } else {
      await moveToGroup(
        viewModel.activeTabId!,
        viewModel.topTabGroup?.tabGroupId,
      );
    }
    window.close();
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
        <input
          type="text"
          id="input-field"
          value={fieldText}
          onChange={(e) => setFieldText(e.target.value)}
          autoFocus={true}
          autoComplete="off"
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
      </form>
      <TabGroupList models={viewModel.sortedTabGroups}></TabGroupList>
    </>
  );
};
