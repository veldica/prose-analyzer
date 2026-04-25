export interface TopRepeatedWord {
  word: string;
  count: number;
  ratio: number;
}

export interface LexicalBase {
  lexical_diversity_ttr: number;
  lexical_diversity_mattr: number;
  lexical_density: number;
  unique_word_count: number;
  repetition_ratio: number;
  top_repeated_words: TopRepeatedWord[];
}

export interface FictionMetrics {
  dialogue_ratio: number;
  avg_dialogue_run_length: number;
  narration_vs_dialogue_balance: "narration_heavy" | "balanced" | "dialogue_heavy";
  scene_density_proxy: number;
  exposition_density_proxy: number;
  sensory_term_density: number;
  abstract_word_ratio: number;
  paragraph_cadence_variation: number;
}

export interface LexicalAnalysisOptions {
  /** The sliding window size for MATTR calculation. Default: 50. */
  windowSize?: number;
  /** Maximum number of top repeated words to return. Default: 10. */
  topRepeatedCount?: number;
  /** Custom stopword detector. If provided, overrides the default. */
  isStopword?: (word: string) => boolean;
}

export interface NarrativeAnalysisOptions {
  /** Custom sensory word detector. */
  isSensory?: (word: string) => boolean;
  /** Custom abstract word detector. */
  isAbstract?: (word: string) => boolean;
}

export interface ProseAnalysisResults {
  lexical: LexicalBase;
  narrative: FictionMetrics;
}

export interface ProseAnalysisOptions {
  lexical?: LexicalAnalysisOptions;
  narrative?: NarrativeAnalysisOptions;
}
