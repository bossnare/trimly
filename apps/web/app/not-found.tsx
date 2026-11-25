import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      <Logo />
      <h1 className="text-gradient font-heading text-6xl font-extrabold tracking-tight">Page not found.</h1>
      <p className="max-w-sm text-muted-foreground">The page you are looking for doesn&apos;t exist or has moved.</p>
      <ButtonLink href="/">Back to home</ButtonLink>
    </main>
  );
}
