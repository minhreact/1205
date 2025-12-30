"use client";

import type { FC } from "react";
import dynamic from "next/dynamic";
import { useFlowStore } from "../src/stores/flow.store";
import StartScreen from "../src/components/StartScreen";

const FlowerGame = dynamic(() => import("../src/game/FlowerGame"), {
  ssr: false,
});

const Page: FC = () => {
  const step = useFlowStore((state) => state.step);

  return (
    <>
      {step === "start" && <StartScreen />}
      {step === "game" && <FlowerGame />}
    </>
  );
};

export default Page;
