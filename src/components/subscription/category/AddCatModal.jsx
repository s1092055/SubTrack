import { useRef, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getContrastTextColor } from "@/utils/format";

const COLOR_PRESETS = [
  "#ec4899",
  "#3b82f6",
  "#34d399",
  "#a78bfa",
  "#f59e0b",
  "#f97316",
];

function isTooLight(hex) {
  if (!hex || hex[0] !== "#" || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.85;
}

export default function AddCatModal({ mode = "manage", existingNames, onCreate, onClose }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ec4899");
  const [error, setError] = useState("");
  const colorPickerRef = useRef(null);

  const colorTooLight = isTooLight(color);
  const isCustomColor = !COLOR_PRESETS.includes(color);

  const validate = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("請輸入分類名稱"); return null; }
    if (existingNames.includes(trimmed)) { setError("此分類名稱已存在"); return null; }
    if (colorTooLight) { setError("顏色過淺，請選擇較深的顏色"); return null; }
    return { name: trimmed, color };
  };

  const handleCreate = (applyImmediately) => {
    const cat = validate();
    if (!cat) return;
    onCreate(cat, applyImmediately);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="sm" showClose={false}>
        <div className="w-full overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
            <h2 className="text-base font-bold text-slate-900">新增分類</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉"
              className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="px-5 pb-4 flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-2 block">分類名稱</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleCreate(false)}
                placeholder="例：運動、教育、交通..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none placeholder-slate-300"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">選擇顏色</label>
              <div className="flex gap-2 items-center">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && !isCustomColor && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => colorPickerRef.current?.click()}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={isCustomColor ? { backgroundColor: color } : { border: "2px dashed #cbd5e1" }}
                    title="自訂顏色"
                  >
                    {isCustomColor ? (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                        <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                  <input
                    ref={colorPickerRef}
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    tabIndex={-1}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">預覽</label>
              <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-2.5">
                <span
                  className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: color, color: getContrastTextColor(color) }}
                >
                  {name || "分類名稱預覽"}
                </span>
              </div>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] px-4 py-4 flex items-center justify-end gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCreate(false)}
              disabled={!name.trim() || colorTooLight}
            >
              新增
            </Button>
            {mode === "select" && (
              <Button
                type="button"
                variant="default"
                onClick={() => handleCreate(true)}
                disabled={!name.trim() || colorTooLight}
              >
                直接套用
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
