import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  collapsed: false,
};

export const useSettingsStore = create<typeof initialState>()(
  persist(() => initialState, { name: "app-settings" }),
);

export function setCollapsed(collapsed: boolean) {
  useSettingsStore.setState({ collapsed });
}
