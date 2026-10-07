"use client";

import type { ReactNode } from "react";
import { GSAPProvider } from "./GSAPProvider";
import { LenisProvider } from "./LenisProvider";
import { ReducedMotionProvider } from "./ReducedMotionProvider";

interface AnimationProvidersProps {
  children: ReactNode;
}

export function AnimationProviders({ children }: AnimationProvidersProps) {
  return (
    <ReducedMotionProvider>
      <LenisProvider>
        <GSAPProvider>{children}</GSAPProvider>
      </LenisProvider>
    </ReducedMotionProvider>
  );
}
