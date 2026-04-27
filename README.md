# @veldica/prose-analyzer

[![NPM Version](https://img.shields.io/npm/v/@veldica/prose-analyzer?color=blue)](https://www.npmjs.com/package/@veldica/prose-analyzer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Dependency Count](https://img.shields.io/badge/dependencies-1-blue)](package.json)

Deterministic prose style metrics for measuring variety, density, repetition, and **narrative texture**. While *readability* (via `@veldica/readability`) measures accessibility, *prose analysis* measures the **sophistication and vividness** of writing. 

Designed for high-precision editorial pipelines, creative writing tools, and content auditing systems where deterministic, explainable signals are required.

## Why Prose Analysis?

In an era of AI-generated content, understanding the "texture" of prose is critical:

- **Measuring "AI-ness"**: Detect the flat lexical fingerprints of LLMs by measuring moving-average diversity and repetition ratios.
- **"Show, Don't Tell" Auditing**: Use **Scene Density** and **Sensory Language** proxies to mathematically evaluate the vividness of narrative sections.
- **Deterministic Consistency**: Unlike LLM-based critiques, these scores are 100% repeatable, local-first, and require zero network calls.
- **Length-Independent Metrics**: Implements an $O(N)$ MATTR (Moving Average TTR) algorithm to accurately and efficiently measure vocabulary richness in texts of any length, from single paragraphs to full-length novels.

## Features

- **High-Performance Lexical Analysis**: Optimized $O(N)$ MATTR algorithm and `Map`-based frequency tracking for massive datasets.
- **Narrative Texture Heuristics**: Deterministic proxies for "active" vs. "passive" writing styles.
- **Linguistic Signal Detection**: Categorization of sensory and abstract language usage with "Sanitize Once" performance.
- **Resilient Logic**: Hardened against regex backtracking and synchronous blocking on large inputs.
- **Tree-Shakable**: ESM-first design with modular exports for lexical, narrative, and categorization tools.

## Core Capabilities

### 1. Lexical Variety & Density
Measures how "rich" the vocabulary is and the ratio of content-carrying words vs. structural filler (stopwords).
- **TTR (Type-Token Ratio)**: Basic unique word ratio.
- **MATTR (Moving-Average TTR)**: A more robust measure of diversity that isn't biased by text length.
- **Lexical Density**: The percentage of content words (nouns, verbs, adjectives) using high-precision filtering.

### 2. Repetition Identification
Automatically detects overused content words while ignoring common stopwords. Provides both raw counts and frequency ratios.

### 3. Narrative Texture
Heuristic-based signals for analyzing the "pacing" of prose:
- **Dialogue Ratio**: The balance between spoken word and narration.
- **Scene Density**: A proxy for "active" writing, calculated by correlating dialogue frequency, high sentence length variation, and short sentence clusters.
- **Exposition Density**: Detects "wall of text" explanation patterns based on paragraph length and sentence complexity.

### 4. Linguistic Signal Detection
- **Sensory Language**: Detection of words related to sight, sound, smell, taste, and touch.
- **Abstract Concepts**: Identification of non-concrete terminology (e.g., "policy", "concept", "theory").

## Installation

```bash
npm install @veldica/prose-analyzer
```

## Quick Start

### Comprehensive Analysis (Recommended)
The easiest way to get a full stylistic profile is using the `analyzeDocument` bridge with the Veldica tokenizer.

```ts
import { tokenize } from "@veldica/prose-tokenizer";
import { analyzeDocument } from "@veldica/prose-analyzer";

const text = `The sun was a bright, heavy disk. "It is time," he said. 
The sky turned from blue to black as the shadows grew long.`;

// 1. Prepare text with the Veldica tokenizer
const doc = tokenize(text);

// 2. Run combined analysis using the bridge
const results = analyzeDocument(doc);

console.log(results.lexical.lexical_diversity_mattr); // 0.85 (High variety)
console.log(results.narrative.scene_density_proxy);   // 0.45 (Active pacing)
console.log(results.narrative.sensory_term_density); // 0.23 (Vivid imagery)
```

### Advanced Usage (Manual Mapping)
If you are using a custom tokenizer, you can call `analyzeProse` directly by providing the required counts.

```ts
import { analyzeProse } from "@veldica/prose-analyzer";

const results = analyzeProse(
  sentences, 
  words, 
  sentenceWordCounts, 
  paragraphWordCounts,
  { 
    lexical: { windowSize: 100 } 
  }
);
```

### Advanced Lexical Options
You can tune the analysis (e.g., changing the MATTR sliding window) to suit specific content types.

```ts
import { analyzeLexical } from "@veldica/prose-analyzer";

const lexical = analyzeLexical(words, {
  windowSize: 100,      // Larger window for long-form prose
  topRepeatedCount: 5,  // Return fewer, more significant repetitions
});
```

### Signal Detection
Use the underlying categorization tools for custom filtering logic.

```ts
import { isSensory, isAbstract } from "@veldica/prose-analyzer";

isSensory("bright"); // true
isAbstract("policy"); // true
```

## API Reference

### `analyzeDocument(doc, options?): ProseAnalysisResults`
The recommended entry point for users of `@veldica/prose-tokenizer`. Automatically maps nested counts and runs a full analysis.
- `doc`: A `TokenizedDocument` from the Veldica tokenizer.
- `options`: (Optional) Object containing `lexical` and `narrative` configurations.

### `analyzeProse(sentences, words, sentenceWordCounts, paragraphWordCounts, options?): ProseAnalysisResults`
Low-level combined entry point. Useful if you are using a custom tokenizer.
- `options`: (Optional) Object containing `lexical` and `narrative` configurations.

### `analyzeLexical(words: string[], options?: LexicalAnalysisOptions): LexicalBase`
Performs frequency and diversity analysis.
- `windowSize`: (Default: 50) The sliding window for MATTR calculation.
- `topRepeatedCount`: (Default: 10) Number of repeated words to return.
- `isStopword`: (Optional) Custom function to override the default stopword detector.

### `analyzeNarrative(sentences, words, sentenceWordCounts, paragraphWordCounts, options?): FictionMetrics`
Calculates narrative pacing and texture.
- `options.isSensory`: (Optional) Custom function for sensory signal detection.
- `options.isAbstract`: (Optional) Custom function for abstract concept detection.

### `isSensory(word: string, isNormalized?: boolean): boolean`
Checks if a word belongs to the sensory language category. Set `isNormalized` to `true` if the word is already lowercased and stripped of non-alpha characters.

### `isAbstract(word: string, isNormalized?: boolean): boolean`
Checks if a word belongs to the abstract concepts category. Set `isNormalized` to `true` if the word is already lowercased and stripped of non-alpha characters.

## Practical Use Cases

- **AI Editorial Pipelines**: Score AI-generated prose for "human-like" lexical variety.
- **Creative Writing Tools**: Provide real-time feedback on "show vs. tell" using scene density proxies.
- **Content Quality Assurance**: Identify repetitive or exposition-heavy sections in technical documentation.
- **Style Consistency**: Ensure multiple authors maintain a consistent narrative texture across a large project.

## Limitations

- **Language Support**: Heuristics and categorizations (sensory/abstract) are currently optimized for **English prose**.
- **Dialogue Detection**: Relies on common quotation mark heuristics. Complex formatting (e.g., non-standard punctuation in experimental fiction) may require custom options.
- **Contextual Nuance**: Like all deterministic metrics, these scores measure "signals" rather than "meaning." They should be used to support, not replace, human editorial judgment.

## Philosophy

We believe prose analysis should be **deterministic** and **explainable**. Unlike LLM-based scores which are opaque and probabilistic, `@veldica/prose-analyzer` provides raw linguistic signals that are:
1. **Fast**: Executed in milliseconds without network calls.
2. **Private**: No data ever leaves your machine.
3. **Consistent**: The same text always yields the same result.
4. **Signal-Focused**: We measure the *mechanics* of the prose (how it is built) rather than attempting to interpret its *meaning*.

## The Veldica Suite

This package is part of the **Veldica** ecosystem of modular, high-performance linguistic tools:

- [`@veldica/prose-tokenizer`](https://www.npmjs.com/package/@veldica/prose-tokenizer): High-precision text segmentation.
- [`@veldica/readability`](https://www.npmjs.com/package/@veldica/readability): Industry-standard readability formulas.
- **`@veldica/prose-analyzer`**: Stylistic variety and narrative texture.

## Contributing

Contributions are welcome! Please follow our established technical mandates:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewMetric`)
3. Ensure all changes pass the unit test suite (`npm test`).
4. Push to the Branch (`git push origin feature/NewMetric`)
5. Open a Pull Request

## Ownership & Authority

This package is maintained by **Veldica** as a core part of our writing analysis platform. It is built for production environments that demand mathematical precision and deterministic reliability.

- **Full Documentation**: [veldica.com/prose-analyzer](https://veldica.com/prose-analyzer)
- **Veldica Platform**: [veldica.com](https://veldica.com)
- **Report Bugs**: [GitHub Issues](https://github.com/veldica/prose-analyzer/issues)

## License

MIT © [Veldica](https://veldica.com)
