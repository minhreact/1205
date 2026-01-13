"use client";

import type { FC } from "react";
import dynamic from "next/dynamic";
import { useFlowStore } from "../src/stores/flow.store";
import StartScreen from "../src/components/StartScreen";

const FlowerGame = dynamic(() => import("../src/game/FlowerGame"), {
  ssr: false,
});

const SlidesStory = dynamic(() => import("../src/slides/SlidesStory"), {
  ssr: false,
});

const LoveForm = dynamic(() => import("../src/form/LoveForm"), {
  ssr: false,
});

const Page: FC = () => {
  const step = useFlowStore((state) => state.step);

  return (
    <>
      {step === "start" && <StartScreen />}
      {step === "game" && <FlowerGame />}
      {step === "slides" && <SlidesStory />}
      {step === "form" && <LoveForm />}
    </>
  );
};

export default Page;
