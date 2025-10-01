// Fallback message loader for i18n
// Prevents build failures when EN files are missing

type Dict = Record<string, any>;

async function importJson(path: string): Promise<Dict | null> {
  try {
    const mod = await import(/* @vite-ignore */ path);
    return (mod as any).default ?? mod;
  } catch {
    return null;
  }
}

export async function loadMessages(locale: string, namespace: string): Promise<Dict> {
  // Path to messages
  const base = `/messages/${locale}/${namespace}.json`;
  const ru = `/messages/ru/${namespace}.json`;

  // Try to load requested locale
  const wanted = await importJson(base);
  if (wanted) return wanted;

  // Fallback to RU for missing files
  const fallback = await importJson(ru);
  if (fallback) return fallback;

  // Last resort — empty object (don't crash)
  return {};
}

// Helper for next-intl
export function getMessages(locale: string, namespace: string) {
  try {
    // Try to require the file directly
    const messages = require(`../../messages/${locale}/${namespace}.json`);
    return messages;
  } catch {
    try {
      // Fallback to RU
      const fallback = require(`../../messages/ru/${namespace}.json`);
      return fallback;
    } catch {
      // Last resort
      return {};
    }
  }
}
