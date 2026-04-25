import {
  round,
  safeDivide,
  clamp,
  mean,
  standardDeviation,
} from "./utils.js";
import { isSensory as defaultIsSensory, isAbstract as defaultIsAbstract } from "./categorization.js";
import { FictionMetrics, NarrativeAnalysisOptions } from "./types.js";

/**
 * Standard heuristic pattern for detecting dialogue in English prose.
 * Matches common straight and smart quotation marks.
 */
const DIALOGUE_PATTERN = /["'“‘].*["'”’]/;

/**
 * Performs deterministic narrative analysis.

 * Measures dialogue balance, scene density, and sensory/abstract language usage.
 */
export function analyzeNarrative(
  sentencesRaw: string[],
  wordsRaw: string[],
  sentenceWordCounts: number[],
  paragraphWordCounts: number[],
  options: NarrativeAnalysisOptions = {}
): FictionMetrics {
  const {
    isSensory = defaultIsSensory,
    isAbstract = defaultIsAbstract
  } = options;

  const sentenceCount = sentencesRaw.length;
  const wordCount = wordsRaw.length;

  if (sentenceCount === 0 || wordCount === 0) {
    return {
      dialogue_ratio: 0,
      avg_dialogue_run_length: 0,
      narration_vs_dialogue_balance: "balanced",
      scene_density_proxy: 0,
      exposition_density_proxy: 0,
      sensory_term_density: 0,
      abstract_word_ratio: 0,
      paragraph_cadence_variation: 0,
    };
  }

  // Dialogue detection (basic quote-based heuristic)
  const dialogueSentences = sentencesRaw.filter((s) => DIALOGUE_PATTERN.test(s));
  const dialogueRatio = safeDivide(dialogueSentences.length, sentenceCount);

  let totalRuns = 0;
  let runCount = 0;
  let inRun = false;
  for (const s of sentencesRaw) {
    if (DIALOGUE_PATTERN.test(s)) {
      if (!inRun) {
        inRun = true;
        runCount++;
      }
      totalRuns++;
    } else {
      inRun = false;
    }
  }
  const avgDialogueRun = round(runCount > 0 ? safeDivide(totalRuns, runCount) : 0, 1);

  let balance: FictionMetrics["narration_vs_dialogue_balance"] = "balanced";
  if (dialogueRatio > 0.6) balance = "dialogue_heavy";
  else if (dialogueRatio < 0.1) balance = "narration_heavy";

  const sentenceLengthVariation = safeDivide(
    standardDeviation(sentenceWordCounts),
    mean(sentenceWordCounts)
  );
  
  // Heuristic for "Scene Density": High variation + dialogue + short sentences
  const shortSentenceRatio = sentencesRaw.filter((_, i) => sentenceWordCounts[i] < 12).length / sentenceCount;
  
  const sceneDensity = round(
    clamp(
      shortSentenceRatio * 0.4 +
        dialogueRatio * 0.4 +
        sentenceLengthVariation * 0.2,
      0,
      1
    ),
    2
  );

  // Heuristic for "Exposition Density": Long paragraphs
  const expositionDensity = round(
    clamp(paragraphWordCounts.filter(count => count > 80).length / paragraphWordCounts.length, 0, 1)
  );

  const sensoryCount = wordsRaw.filter((w) => isSensory(w)).length;
  const sensoryDensity = round(safeDivide(sensoryCount, wordCount), 4);

  const abstractCount = wordsRaw.filter((w) => isAbstract(w)).length;
  const abstractRatio = round(safeDivide(abstractCount, wordCount), 4);

  return {
    dialogue_ratio: round(dialogueRatio, 4),
    avg_dialogue_run_length: avgDialogueRun,
    narration_vs_dialogue_balance: balance,
    scene_density_proxy: sceneDensity,
    exposition_density_proxy: expositionDensity,
    sensory_term_density: sensoryDensity,
    abstract_word_ratio: abstractRatio,
    paragraph_cadence_variation: round(standardDeviation(paragraphWordCounts), 2),
  };
}
