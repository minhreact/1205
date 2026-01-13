import { create } from "zustand";

export type Step = "start" | "game" | "done" | "slides" | "form";

export interface FlowState {
  step: Step;
  start: () => void;
  complete: () => void;
  goToSlides: () => void;
  goToForm: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  step: "start",
  start: () => set({ step: "game" }),
  complete: () => set({ step: "done" }),
  goToSlides: () => set({ step: "slides" }),
  goToForm: () => set({ step: "form" }),
}));
