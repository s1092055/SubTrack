export const CATEGORIES = {
  娛樂: { badge: "bg-purple-100 text-purple-600", color: "#a78bfa" },
  工作: { badge: "bg-blue-100 text-blue-600", color: "#60a5fa" },
  生活: { badge: "bg-green-100 text-green-600", color: "#34d399" },
  其他: { badge: "bg-gray-100 text-gray-600", color: "#94a3b8" },
};

export const DEFAULT_CATEGORY_LIST = [
  { name: "娛樂", color: "#a78bfa" },
  { name: "工作", color: "#60a5fa" },
  { name: "生活", color: "#34d399" },
  { name: "其他", color: "#94a3b8" },
];
export const getCategoryColor = (name) =>
  (CATEGORIES[name] || CATEGORIES["其他"]).color;

export const getCategoryBadge = (name) =>
  (CATEGORIES[name] || CATEGORIES["其他"]).badge;
