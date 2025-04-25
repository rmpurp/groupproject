import { TabGroupViewModel } from "../model/tab-group-view-model";

export const TabGroupButton = ({ model }: { model: TabGroupViewModel }) => {
  return (
    <button key={model.tabGroupId} className={model.classes}>
      {model.displayName}
    </button>
  );
};
