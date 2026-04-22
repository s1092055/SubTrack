const BRAND_COLORS = {
  netflix: "#E50914",
  spotify: "#1DB954",
  youtube: "#FF0000",
  disney: "#0063E5",
  chatgpt: "#10A37F",
  openai: "#10A37F",
  adobe: "#FF4A00",
  notion: "#37352F",
  icloud: "#007AFF",
  apple: "#007AFF",
  github: "#24292E",
  copilot: "#6e40c9",
  figma: "#F24E1E",
  slack: "#4A154B",
  zoom: "#2D8CFF",
  dropbox: "#0061FF",
  linkedin: "#0A66C2",
  twitter: "#1DA1F2",
  twitch: "#9146FF",
  amazon: "#FF9900",
  prime: "#00A8E0",
  microsoft: "#00A4EF",
  office: "#D83B01",
  google: "#4285F4",
  arcade: "#4285F4",
  hbo: "#6F2DA8",
  max: "#6F2DA8",
  line: "#06C755",
  ps: "#003087",
  playstation: "#003087",
  xbox: "#107C10",
  nintendo: "#E60012",
};

const FALLBACK_COLORS = [
  "#475569",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#22C55E",
  "#14B8A6",
  "#3B82F6",
  "#1d3557",
  "#A855F7",
  "#EC4899",
];

export const getAvatarColor = (name) => {
  const lower = name.toLowerCase();
  for (const [key, color] of Object.entries(BRAND_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return FALLBACK_COLORS[name.charCodeAt(0) % FALLBACK_COLORS.length];
};
