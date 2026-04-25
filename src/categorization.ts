export const SENSORY_WORDS = new Set([
  "see", "seen", "saw", "look", "looked", "gaze", "gazed", "stare", "stared", "glance", "glanced", "bright", "dark", "color", "red", "blue", "green", "yellow", "black", "white", "shadow", "light",
  "hear", "heard", "listen", "listened", "sound", "noise", "quiet", "loud", "soft", "whisper", "shout", "click", "clatter", "rumble", "hiss", "buzz", "ring", "thud",
  "smell", "smelled", "scent", "aroma", "stink", "taste", "tasted", "sweet", "sour", "bitter", "salty",
  "touch", "touched", "feel", "felt", "rough", "smooth", "hard", "soft", "cold", "hot", "warm", "sharp", "heavy", "light", "sticky", "wet", "dry", "pain", "pressure"
]);

export const ABSTRACT_WORDS = new Set([
  "truth", "justice", "freedom", "love", "hate", "idea", "concept", "theory", "belief", "system", "policy", "context", "strategy", "framework", "analysis", "aspect", "category", "criteria", "data", "definition", "environment", "evidence", "factor", "function", "interpretation", "method", "principle", "procedure", "process", "range", "role", "section", "source", "structure", "variable", "wisdom", "moral", "ethic", "value", "standard", "quality", "quantity", "logic"
]);

export function isSensory(word: string): boolean {
  return SENSORY_WORDS.has(word.toLowerCase().replace(/[^a-z]/g, ""));
}

export function isAbstract(word: string): boolean {
  return ABSTRACT_WORDS.has(word.toLowerCase().replace(/[^a-z]/g, ""));
}
