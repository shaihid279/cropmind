"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("kisanscan_onboarded");
    if (!done && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (!ready && pathname !== "/onboarding") return null;
  return <>{children}</>;
}