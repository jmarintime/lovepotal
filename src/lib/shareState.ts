"use client";

export function copyTextWithFallback(text: string): boolean {
  if (typeof window === "undefined") return false;

  // Fallback textarea copy (works synchronously inside user gesture on all browsers)
  let copied = false;
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    copied = document.execCommand("copy");
    document.body.removeChild(textArea);
  } catch {
    copied = false;
  }

  // Also try async Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
    copied = true;
  }

  return copied;
}

export function encodeSharePayload(data: Record<string, unknown>): string {
  try {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  } catch {
    return "";
  }
}

export function decodeSharePayload<T = Record<string, unknown>>(encoded: string): T | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
