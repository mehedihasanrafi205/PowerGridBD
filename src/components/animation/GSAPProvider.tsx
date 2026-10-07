"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createContext, type ReactNode, useContext, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

interface GSAPContextValue {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}

const GSAPContext = createContext<GSAPContextValue | null>(null);

export function useGSAP() {
  const context = useContext(GSAPContext);
  if (!context) {
    throw new Error("useGSAP must be used within a GSAPProvider");
  }
  return context;
}

interface GSAPProviderProps {
  children: ReactNode;
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      const triggers = ScrollTrigger.getAll();
      for (let i = 0; i < triggers.length; i++) {
        triggers[i].kill();
      }
    };
  }, []);

  return (
    <GSAPContext.Provider value={{ gsap, ScrollTrigger }}>
      {children}
    </GSAPContext.Provider>
  );
}
