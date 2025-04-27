import { useEffect, useState } from "react";

export const useFetchTabGroups = () => {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const fetchedTabGroups = await chrome.tabGroups.query({});
      if (isMounted) {
        setTabGroups(fetchedTabGroups);
      }
    };
    // TODO: add error handling
    loadData().catch();

    return () => {
      isMounted = false;
    };
  }, []);

  return tabGroups;
};
