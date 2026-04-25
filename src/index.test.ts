import { describe, it } from "node:test";
import assert from "node:assert";
import { analyzeLexical, analyzeNarrative, isSensory, isAbstract, analyzeProse } from "./index.js";

describe("Combined Analysis", () => {
  it("runs both lexical and narrative analysis", () => {
    const sentences = ["The truth is bright."];
    const words = ["the", "truth", "is", "bright"];
    const sentenceWordCounts = [4];
    const paragraphWordCounts = [4];

    const result = analyzeProse(sentences, words, sentenceWordCounts, paragraphWordCounts);
    
    assert.ok(result.lexical);
    assert.ok(result.narrative);
    assert.strictEqual(result.lexical.unique_word_count, 4);
    assert.ok(result.narrative.sensory_term_density > 0);
  });
});

describe("Lexical Analysis", () => {
  it("calculates basic diversity metrics (TTR)", () => {
    const words = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];
    const result = analyzeLexical(words);
    
    assert.strictEqual(result.unique_word_count, 8);
    assert.ok(result.lexical_diversity_ttr > 0.8 && result.lexical_diversity_ttr < 0.9);
  });

  it("identifies top repeated content words", () => {
    const words = ["apple", "banana", "apple", "cherry", "banana", "apple", "the", "the", "the"];
    const result = analyzeLexical(words);
    
    const apple = result.top_repeated_words.find(w => w.word === "apple");
    assert.ok(apple);
    assert.strictEqual(apple?.count, 3);
    
    // "the" is a stopword and should be excluded from top_repeated_words
    const the = result.top_repeated_words.find(w => w.word === "the");
    assert.strictEqual(the, undefined);
  });

  it("handles empty input gracefully", () => {
    const result = analyzeLexical([]);
    assert.strictEqual(result.unique_word_count, 0);
    assert.strictEqual(result.lexical_diversity_ttr, 0);
  });
});

describe("Narrative Analysis", () => {
  it("detects dialogue ratios", () => {
    const sentences = [
      '"Hello," he said.',
      "He walked away.",
      '"Wait!" she called.'
    ];
    const words = ["hello", "he", "said", "he", "walked", "away", "wait", "she", "called"];
    const sentenceWordCounts = [3, 3, 3];
    const paragraphWordCounts = [9];

    const result = analyzeNarrative(sentences, words, sentenceWordCounts, paragraphWordCounts);
    
    assert.ok(result.dialogue_ratio > 0.6);
    assert.strictEqual(result.narration_vs_dialogue_balance, "dialogue_heavy");
  });

  it("identifies sensory and abstract language", () => {
    const words = ["truth", "justice", "see", "bright", "policy"];
    const sentences = ["The truth is easy to see."];
    
    const result = analyzeNarrative(sentences, words, [6], [6]);
    
    assert.ok(result.sensory_term_density > 0);
    assert.ok(result.abstract_word_ratio > 0);
  });
});

describe("Categorization", () => {
  it("correctly identifies sensory words", () => {
    assert.strictEqual(isSensory("bright"), true);
    assert.strictEqual(isSensory("Bright!"), true);
    assert.strictEqual(isSensory("computer"), false);
  });

  it("correctly identifies abstract words", () => {
    assert.strictEqual(isAbstract("justice"), true);
    assert.strictEqual(isAbstract("concept"), true);
    assert.strictEqual(isAbstract("apple"), false);
  });
});
