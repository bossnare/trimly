import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ButtonLink } from "@/components/ui/button-link";
import { NAV_LINKS } from "../content";

export function LandingNav() {
  return (
    <div className="sticky top-3 z-20 px-4">
      <nav
        aria-label="Main"
        className="border-border bg-background/70 mx-auto flex max-w-270 items-center justify-between gap-4 rounded-full border py-2 pr-2 pl-4 backdrop-blur-md"
      >
        <Logo />
        <ul className="text-muted-foreground flex gap-7 text-[15px] max-lg:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-foreground focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/editor" size="sm">
            Open the app
          </ButtonLink>
        </div>
      </nav>
    </div>
  );
}
