import { useEffect, useState } from "react";

export const useActiveTab = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | undefined>(
    undefined,
  );

  useEffect(() => {
    const loadData = async () => {
      let queryOptions = { active: true, lastFocusedWindow: true };
      let [activeTab] = await chrome.tabs.query(queryOptions);
      setActiveTab(activeTab);
    };
    // TODO: add error handling
    loadData().catch();
  }, []);
  return activeTab;
};
