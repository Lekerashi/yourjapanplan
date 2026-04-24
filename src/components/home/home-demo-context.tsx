"use client";

import { createContext, useContext, useState } from "react";

type Ctx = {
  selectedInterests: Set<string>;
  toggleInterest: (value: string) => void;
  clearInterests: () => void;
};

const HomeDemoContext = createContext<Ctx | null>(null);

export function HomeDemoProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: string[];
}) {
  const [selectedInterests, setSelected] = useState<Set<string>>(
    () => new Set(initial ?? []),
  );

  const toggleInterest = (value: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const clearInterests = () => setSelected(new Set());

  return (
    <HomeDemoContext.Provider
      value={{ selectedInterests, toggleInterest, clearInterests }}
    >
      {children}
    </HomeDemoContext.Provider>
  );
}

export function useHomeDemo(): Ctx {
  const ctx = useContext(HomeDemoContext);
  if (!ctx) {
    return {
      selectedInterests: new Set(),
      toggleInterest: () => {},
      clearInterests: () => {},
    };
  }
  return ctx;
}
