export const SENSORY_WORDS = new Set([
  // Visual
  "see", "seen", "saw", "look", "looked", "gaze", "gazed", "stare", "stared", "glance", "glanced", "bright", "dark", "color", 
  "red", "blue", "green", "yellow", "black", "white", "orange", "purple", "violet", "gray", "grey", "silver", "gold", "brown",
  "shadow", "light", "glow", "gleam", "sparkle", "shimmer", "vivid", "pale", "dull", "shiny", "blur", "blurry",
  // Auditory
  "hear", "heard", "listen", "listened", "sound", "noise", "quiet", "silent", "loud", "soft", "whisper", "shout", "scream", "cry",
  "click", "clatter", "rumble", "hiss", "buzz", "ring", "thud", "bang", "crash", "hum", "murmur", "melody", "rhythm",
  // Olfactory / Gustatory
  "smell", "smelled", "scent", "aroma", "stink", "stench", "fragrance", "perfume", "taste", "tasted", "flavor", "savour",
  "sweet", "sour", "bitter", "salty", "salt", "sugar", "honey", "spice", "spicy", "acrid", "pungent", "delicious",
  // Tactile / Somatic
  "touch", "touched", "feel", "felt", "rough", "smooth", "hard", "soft", "cold", "hot", "warm", "cool", "chill", "chilly",
  "sharp", "heavy", "light", "sticky", "wet", "dry", "pain", "pressure", "soft", "hard", "solid", "liquid", "gas",
  "itch", "sting", "burn", "prickle", "smooth", "grainy", "slimy", "slick", "velvety", "silky"
]);

export const ABSTRACT_WORDS = new Set([
  "truth", "justice", "freedom", "love", "hate", "idea", "concept", "theory", "belief", "system", "policy", "context", "strategy", 
  "framework", "analysis", "aspect", "category", "criteria", "data", "definition", "environment", "evidence", "factor", 
  "function", "interpretation", "method", "principle", "procedure", "process", "range", "role", "section", "source", 
  "structure", "variable", "wisdom", "moral", "ethic", "value", "standard", "quality", "quantity", "logic",
  "paradigm", "objective", "subjective", "perspective", "fundamental", "abstraction", "complexity", "notion", "utilization",
  "implementation", "integration", "infrastructure", "governance", "compliance", "optimization", "efficiency", "effectiveness"
]);

export function isSensory(word: string): boolean {
  return SENSORY_WORDS.has(word.toLowerCase().replace(/[^a-z]/g, ""));
}

export function isAbstract(word: string): boolean {
  return ABSTRACT_WORDS.has(word.toLowerCase().replace(/[^a-z]/g, ""));
}
