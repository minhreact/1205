import { create } from "zustand";

export type Step = "start" | "game" | "done";

export interface FlowState {
  step: Step;
  start: () => void;
  complete: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  step: "start",
  start: () => set({ step: "game" }),
  complete: () => set({ step: "done" }),
}));
