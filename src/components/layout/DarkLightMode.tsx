"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DarkLightMode() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else setTheme("dark");
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun size={19} className="dark:scale-0" />
      <Moon size={19} className="absolute scale-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
