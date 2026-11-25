"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function MobileMenuToggle() {
  return (
    <Button variant="outline" size="icon" onClick={() => null} aria-label={"Open menu"}>
      <Menu aria-hidden className="size-4.5" />
    </Button>
  );
}
