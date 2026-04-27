import { describe, it } from "node:test";
import assert from "node:assert";
import { analyzeProse } from "./index.js";

describe("Golden Sample Analysis", () => {
  it("produces consistent results for a standard literary sample", () => {
    // A sample containing narration, dialogue, sensory words, and repetition.
    const sentences = [
      "The sun was a bright, heavy disk in the sky.",
      "He looked at the red horizon and felt the dry wind.",
      '"It is time," he said softly.',
      "The sky turned from blue to black as the shadows grew long.",
      "He felt the cold pressure of the night."
    ];
    
    const words = [
      "the", "sun", "was", "a", "bright", "heavy", "disk", "in", "the", "sky",
      "he", "looked", "at", "the", "red", "horizon", "and", "felt", "the", "dry", "wind",
      "it", "is", "time", "he", "said", "softly",
      "the", "sky", "turned", "from", "blue", "to", "black", "as", "the", "shadows", "grow", "long",
      "he", "felt", "the", "cold", "pressure", "of", "the", "night"
    ];

    const sentenceWordCounts = [10, 11, 6, 12, 8];
    const paragraphWordCounts = [47];

    const results = analyzeProse(sentences, words, sentenceWordCounts, paragraphWordCounts);

    // Lexical Integrity
    assert.strictEqual(results.lexical.unique_word_count, 36);
    assert.ok(results.lexical.lexical_diversity_ttr > 0.75);
    
    // Narrative Integrity
    assert.ok(results.narrative.dialogue_ratio > 0.1);
    assert.ok(results.narrative.sensory_term_density > 0.2); // bright, heavy, looked, red, dry, felt, blue, black, felt, cold, pressure
    assert.strictEqual(results.narrative.narration_vs_dialogue_balance, "balanced");
    
    // Deterministic Stability
    const repeatResult = analyzeProse(sentences, words, sentenceWordCounts, paragraphWordCounts);
    assert.deepStrictEqual(results, repeatResult);
  });
});
