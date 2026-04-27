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

  const normalizedWords: string[] = [];
  const wordCounts = new Map<string, number>();
  let contentWordCount = 0;

  for (const word of words) {
    const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!normalized) continue;
    
    normalizedWords.push(normalized);
    wordCounts.set(normalized, (wordCounts.get(normalized) || 0) + 1);
    if (!isStopword(normalized)) {
      contentWordCount++;
    }
  }

  const uniqueWords = wordCounts.size;
  const ttr = safeDivide(uniqueWords, words.length);
  const density = safeDivide(contentWordCount, words.length);

  // Moving Average Type-Token Ratio (MATTR)
  const actualWindowSize = Math.min(windowSize, normalizedWords.length);
  let totalWindowTtr = 0;
  let windowCount = 0;

  if (normalizedWords.length >= actualWindowSize && actualWindowSize > 0) {
    const windowMap = new Map<string, number>();
    
    // Initialize first window
    for (let i = 0; i < actualWindowSize; i++) {
      const w = normalizedWords[i];
      windowMap.set(w, (windowMap.get(w) || 0) + 1);
    }
    totalWindowTtr += safeDivide(windowMap.size, actualWindowSize);
    windowCount++;

    // Slide window
    for (let i = 1; i <= normalizedWords.length - actualWindowSize; i++) {
      const oldWord = normalizedWords[i - 1];
      const newWord = normalizedWords[i + actualWindowSize - 1];

      // Remove old word
      const oldCount = windowMap.get(oldWord)!;
      if (oldCount === 1) {
        windowMap.delete(oldWord);
      } else {
        windowMap.set(oldWord, oldCount - 1);
      }

      // Add new word
      windowMap.set(newWord, (windowMap.get(newWord) || 0) + 1);

      totalWindowTtr += safeDivide(windowMap.size, actualWindowSize);
      windowCount++;
    }
  }
  const mattr = windowCount > 0 ? safeDivide(totalWindowTtr, windowCount) : ttr;

  let repeatedTokenCount = 0;
  for (const count of wordCounts.values()) {
    repeatedTokenCount += Math.max(0, count - 1);
  }
  const repetitionRatio = safeDivide(repeatedTokenCount, words.length);

  const topRepeatedWords = Array.from(wordCounts.entries())
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
