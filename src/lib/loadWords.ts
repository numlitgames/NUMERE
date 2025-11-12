import data from "../../data/words.i18n.json";

export type WordEntry = {
  id: string;
  cat: string;
  slug: string;
  img: string;
  t: Record<string, string>;
  audio?: Record<string, string>;
  tags?: string[];
};

export const words = data as WordEntry[];

export function byCategory(cat: string): WordEntry[] {
  return words.filter(w => w.cat === cat);
}

export function getRandomWordFromCategory(category: string): WordEntry | null {
  const categoryWords = byCategory(category);
  if (categoryWords.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * categoryWords.length);
  return categoryWords[randomIndex];
}

export function getAllCategories(): string[] {
  const categories = new Set(words.map(w => w.cat));
  return Array.from(categories);
}