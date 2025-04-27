import { useState } from "react";
import { State as AppViewModel } from "../model/state";
import { TabGroupList } from "./tab-group-list";
import { useFetchTabGroups } from "./hooks/use-fetch-tab-groups";
import { useActiveTab } from "./hooks/use-active-tab";

const moveToGroup = async (
  tabId: number,
  groupId?: number,
): Promise<number> => {
  return await chrome.tabs.group({ tabIds: [tabId], groupId: groupId });
};

export const TabGroupSelector = () => {
  const [fieldText, setFieldText] = useState("");

  const tabGroups = useFetchTabGroups();
  const activeTab = useActiveTab();

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
