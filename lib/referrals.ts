// Sistema de Referidos

export interface Referral {
  code: string;
  userId: string;
  uses: number;
  earnings: number;
  created_at: Date;
}

/**
 * Generar código de referido único
 */
export function generateReferralCode(userId: string): string {
  const hash = userId.substring(0, 8).toUpperCase();
  return `REME-${hash}`;
}

/**
 * Obtener link de referido
 */
export function getReferralLink(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://reme-lat-usa.com";
  return `${baseUrl}?ref=${code}`;
}

/**
 * Validar código de referido
 */
export async function validateReferralCode(code: string): Promise<boolean> {
  // Implementar validación con Supabase
  // Por ahora retorna true para códigos válidos
  return code.startsWith("REME-") && code.length === 13;
}

/**
 * Obtener código de referido del usuario desde URL
 */
export function getReferralCodeFromURL(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

/**
 * Guardar referido en localStorage
 */
export function saveReferral(code: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem("referral_code", code);
  localStorage.setItem("referral_timestamp", new Date().toISOString());
}

/**
 * Obtener referido guardado
 */
export function getSavedReferral(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("referral_code");
}

/**
 * Calcular comisión por referido
 * Por ejemplo: 10% de lo que el referido genere en afiliados
 */
export function calculateReferralCommission(amount: number): number {
  return amount * 0.1; // 10% comisión
}

/**
 * Compartir link de referido
 */
export async function shareReferralLink(code: string) {
  const url = getReferralLink(code);
  const text = `¡Compara remesas LAT-USA y ahorra dinero! 💧 Usa mi código: ${code}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "REME LAT-USA",
        text: text,
        url: url,
      });
      return true;
    } catch (err) {
      console.error("Error sharing:", err);
      return false;
    }
  } else {
    // Fallback: copiar al clipboard
    await navigator.clipboard.writeText(url);
    return true;
  }
}
