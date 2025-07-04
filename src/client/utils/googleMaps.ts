export const getGoogleMapsApiKey = (): string => {
  // Prefer Vite client env variable
  const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  if (typeof envKey === "string" && envKey.trim().length > 0) {
    return envKey.trim();
  }

  // Fallback to runtime global (allows manual injection)
  const globalKey = (globalThis as any).GOOGLE_MAPS_API_KEY;
  if (typeof globalKey === "string" && globalKey.trim().length > 0) {
    return globalKey.trim();
}
  return "YOUR_API_KEY"; // Final fallback – will trigger InvalidKeyMapError
}; 