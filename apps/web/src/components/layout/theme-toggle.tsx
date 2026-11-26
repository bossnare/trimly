"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // false on the server and during hydration, true afterwards: avoids a theme mismatch flash.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isDark = resolvedTheme === "dark";
  // const Icon = isDark ? Sun : Moon;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle color theme"}
    >
      {mounted &&
        (isDark ? <Sun aria-hidden className="size-4.5" /> : <Moon aria-hidden className="size-4.5" />)}
    </Button>
  );
}
