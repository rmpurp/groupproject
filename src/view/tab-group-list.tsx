import { TabGroupViewModel } from "../model/tab-group-view-model";
import { TabGroupButton } from "./tab-group-button";

export const TabGroupList = ({ models }: { models: TabGroupViewModel[] }) => (
  <>
    {models.map((model) => (
      <TabGroupButton model={model} />
    ))}
  </>
);
