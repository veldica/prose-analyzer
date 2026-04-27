export * from "./types.js";
export * from "./lexical.js";
export * from "./narrative.js";
export * from "./categorization.js";
export { round, safeDivide } from "./utils.js";

import { analyzeLexical } from "./lexical.js";
import { analyzeNarrative } from "./narrative.js";
import { splitWords } from "@veldica/prose-tokenizer";
import type { ProseAnalysisResults, ProseAnalysisOptions, TokenizedDocument } from "./types.js";

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

/**
 * A bridge utility that accepts a TokenizedDocument (from @veldica/prose-tokenizer)
 * and automatically calculates the required word counts for the analyzer.
 */
export function analyzeDocument(
  doc: TokenizedDocument,
  options: ProseAnalysisOptions = {}
): ProseAnalysisResults {
  const sentenceWordCounts = doc.sentences.map((s) => splitWords(s).length);
  const paragraphWordCounts = doc.paragraphs.map((p) => splitWords(p).length);

  return analyzeProse(doc.sentences, doc.words, sentenceWordCounts, paragraphWordCounts, options);
}
