import { ClosingPanel } from "@/features/landing/components/closing-panel";
import { Facts } from "@/features/landing/components/facts";
import { Hero } from "@/features/landing/components/hero";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { ProductWindow } from "@/features/landing/components/product-window";
import { Steps } from "@/features/landing/components/steps";
import { ToolsBento } from "@/features/landing/components/tools-bento";

export default function LandingPage() {
  return (
    <div className="relative overflow-x-clip">
      {/* Two faint rings behind the hero. Decorative only. */}
      <div
        aria-hidden
        className="arc pointer-events-none absolute -top-95 left-1/2 size-325 -translate-x-1/2"
      />
      <div
        aria-hidden
        className="arc pointer-events-none absolute -top-35 left-1/2 size-205 -translate-x-1/2"
      />
      <LandingNav />
      <Hero />
      <ProductWindow />
      <ToolsBento />
      <Steps />
      <Facts />
      <ClosingPanel />
      <LandingFooter />
    </div>
  );
}
