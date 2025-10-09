"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview, initGA } from "@/lib/analytics";
import { getReferralCodeFromURL, saveReferral } from "@/lib/referrals";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Inicializar Google Analytics
    initGA();

    // Guardar código de referido si existe
    const refCode = getReferralCodeFromURL();
    if (refCode) {
      saveReferral(refCode);
    }
  }, []);

  useEffect(() => {
    // Track page view en cada cambio de ruta
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParams]);

  return null;
}
