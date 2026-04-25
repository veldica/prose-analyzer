export * from "./types.js";
export * from "./lexical.js";
export * from "./narrative.js";
export * from "./categorization.js";
export { round, safeDivide } from "./utils.js";

import { analyzeLexical } from "./lexical.js";
import { analyzeNarrative } from "./narrative.js";
import type { ProseAnalysisResults, ProseAnalysisOptions } from "./types.js";

/**
 * Executes both lexical and narrative analysis on tokenized input.
 */
export function analyzeProse(
  sentences: string[],
  words: string[],
  sentenceWordCounts: number[],
  paragraphWordCounts: number[],
  options: ProseAnalysisOptions = {}
): ProseAnalysisResults {
  return {
    lexical: analyzeLexical(words, options.lexical),
    narrative: analyzeNarrative(sentences, words, sentenceWordCounts, paragraphWordCounts, options.narrative),
  };
}
