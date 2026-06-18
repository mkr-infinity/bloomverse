"use client";

import { useEffect, useState } from "react";
import { readLocalValue, writeLocalValue } from "@/lib/local-persistence";

export function useLocalStorageState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(readLocalValue(key, fallback));
    setHydrated(true);
  }, [fallback, key]);

  useEffect(() => {
    if (hydrated) {
      writeLocalValue(key, value);
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated] as const;
}
