export const uid = (): string => {
  try {
    // Use native crypto.randomUUID when available
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
      return (crypto as any).randomUUID();
    }
  } catch (e) {
    // ignore
  }
  // Fallback
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};