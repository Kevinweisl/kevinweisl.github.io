// CJK is read per character (~400 chars/min); Latin per word (~200 words/min).
export function estimateReadingMinutes(content: string): number {
  const cjkCount = (content.match(/[一-鿿぀-ヿ]/g) || []).length;
  const latinWords = content
    .replace(/[一-鿿぀-ヿ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjkCount / 400 + latinWords / 200));
}
