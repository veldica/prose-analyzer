import { isStopword as defaultIsStopword } from "@veldica/prose-tokenizer";
import { round, safeDivide } from "./utils.js";
import type { LexicalBase, LexicalAnalysisOptions } from "./types.js";

/**
 * Performs deterministic lexical analysis on a sequence of words.
 * Measures variety, density, and repetition.
 */
export function analyzeLexical(
  words: string[],
  options: LexicalAnalysisOptions = {}
): LexicalBase {
  const { 
    windowSize = 50, 
    topRepeatedCount = 10,
    isStopword = defaultIsStopword 
  } = options;

  if (words.length === 0) {
    return {
      lexical_diversity_ttr: 0,
      lexical_diversity_mattr: 0,
      lexical_density: 0,
      unique_word_count: 0,
      repetition_ratio: 0,
      top_repeated_words: [],
    };
  }

  const wordCounts: Record<string, number> = {};
  let contentWordCount = 0;

  for (const word of words) {
    const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!normalized) continue;
    
    wordCounts[normalized] = (wordCounts[normalized] || 0) + 1;
    if (!isStopword(normalized)) {
      contentWordCount++;
    }
  }

  const uniqueWords = Object.keys(wordCounts).length;
  const ttr = safeDivide(uniqueWords, words.length);
  const density = safeDivide(contentWordCount, words.length);

  // Moving Average Type-Token Ratio (MATTR)
  const actualWindowSize = Math.min(windowSize, words.length);
  let totalWindowTtr = 0;
  let windowCount = 0;

  if (words.length >= actualWindowSize) {
    for (let i = 0; i <= words.length - actualWindowSize; i++) {
      const window = words.slice(i, i + actualWindowSize);
      const windowUnique = new Set(window.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))).size;
      totalWindowTtr += safeDivide(windowUnique, actualWindowSize);
      windowCount++;
    }
  }
  const mattr = windowCount > 0 ? safeDivide(totalWindowTtr, windowCount) : ttr;

  const repeatedTokenCount = Object.values(wordCounts).reduce(
    (total, count) => total + Math.max(0, count - 1),
    0
  );
  const repetitionRatio = safeDivide(repeatedTokenCount, words.length);

  const topRepeatedWords = Object.entries(wordCounts)
    .filter(([word, count]) => !isStopword(word) && count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topRepeatedCount)
    .map(([word, count]) => ({
      word,
      count,
      ratio: round(safeDivide(count, words.length)),
    }));

  return {
    lexical_diversity_ttr: round(ttr),
    lexical_diversity_mattr: round(mattr),
    lexical_density: round(density),
    unique_word_count: uniqueWords,
    repetition_ratio: round(repetitionRatio),
    top_repeated_words: topRepeatedWords,
  };
}
