import { useEffect, useReducer } from "react";
import { AppViewModel } from "../../model/state";

interface AppState {
  fieldText: string;
  tabGroups: chrome.tabGroups.TabGroup[];
  activeTab: chrome.tabs.Tab | undefined;
  errors: string[];
}

export type Action =
  | { type: "update-field-text"; updatedFieldText: string }
  | { type: "set-tab-groups"; tabGroups: chrome.tabGroups.TabGroup[] }
  | { type: "set-active-tab"; tab: chrome.tabs.Tab | undefined }
  | { type: "add-error"; errorMessage: string };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "update-field-text":
      return { ...state, fieldText: action.updatedFieldText };
    case "set-tab-groups":
      return { ...state, tabGroups: action.tabGroups };
    case "set-active-tab":
      return { ...state, activeTab: action.tab };
    case "add-error":
      return { ...state, errors: [...state.errors, action.errorMessage] };
  }
};

export interface UseAppStateContext {
  viewModel: AppViewModel;
  updateFieldText: (fieldText: string) => void;
}

export const useAppState = (): UseAppStateContext => {
  const [state, dispatch] = useReducer(reducer, {
    fieldText: "",
    tabGroups: [],
    activeTab: undefined,
    errors: [],
  });

  // Helper to add error to errors array in state
  const addError = (error: unknown) => {
    console.error(error);
    if (error instanceof Error) {
      dispatch({ type: "add-error", errorMessage: error.message });
    }
  };

  // Load tab groups
  useEffect(() => {
    chrome.tabGroups.query({}).then((tabGroups) => {
      dispatch({ type: "set-tab-groups", tabGroups });
    }, addError);
  }, []);

  // Load active tab
  useEffect(() => {
    let queryOptions = { active: true, lastFocusedWindow: true };

    chrome.tabs.query(queryOptions).then((queryResult) => {
      dispatch({ type: "set-active-tab", tab: queryResult[0] });
    }, addError);
  }, []);

  const updateFieldText = (fieldText: string) =>
    dispatch({ type: "update-field-text", updatedFieldText: fieldText });

  return {
    viewModel: new AppViewModel(
      state.tabGroups,
      state.activeTab,
      state.fieldText,
    ),
    updateFieldText,
  };
};
