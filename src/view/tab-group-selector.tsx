import { TabGroupList } from "./tab-group-list";
import { useAppState } from "./hooks/use-app-state";

const moveToGroup = async (
  tabId: number,
  groupId?: number,
): Promise<number> => {
  return await chrome.tabs.group({ tabIds: [tabId], groupId: groupId });
};

export const TabGroupSelector = () => {
  const { viewModel, updateFieldText } = useAppState();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent page refresh

    // TODO: fix this leaky abstraction
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
          value={viewModel.fieldText}
          onChange={(e) => updateFieldText(e.target.value)}
          autoFocus={true}
          autoComplete="off"
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
      </form>
      <TabGroupList models={viewModel.sortedTabGroups}></TabGroupList>
    </>
  );
};
