import { DONUT_COLORS } from "../../utils/overviewDisplay";

const CARD_BASE =
  "rounded-card border border-subtrack-line bg-subtrack-card shadow-[0_6px_20px_rgba(0,0,0,0.04)]";

function cardClass(extra = "") {
  return `${CARD_BASE} ${extra}`;
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-normal text-subtrack-text">
        {title}
      </h2>
      <p className="mt-1 text-sm text-subtrack-muted">{subtitle}</p>
    </div>
  );
}

export default function CategoryBreakdownCard({ items, formatAmount }) {
  const segments = items
    .reduce(
      (result, item, index) => {
        const end = result.cursor + item.percent;

        return {
          cursor: end,
          parts: [
            ...result.parts,
            `${DONUT_COLORS[index % DONUT_COLORS.length]} ${result.cursor}% ${end}%`,
          ],
        };
      },
      { cursor: 0, parts: [] }
    )
    .parts.join(", ");

  return (
    <section className={cardClass("p-6")}>
      <SectionHeader title="分類支出占比" subtitle="依訂閱分類的月支出比例" />

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_180px] md:items-center">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.name}
              className="grid grid-cols-[1fr_auto] items-center gap-4 text-sm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        DONUT_COLORS[index % DONUT_COLORS.length],
                    }}
                  />
                  <span className="font-medium text-subtrack-text">
                    {item.name}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-subtrack-panel">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor:
                        DONUT_COLORS[index % DONUT_COLORS.length],
                    }}
                  />
                </div>
              </div>

              <span className="text-right text-subtrack-muted">
                {item.percent}% · {formatAmount(item.amount)}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mx-auto flex h-40 w-40 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${segments})` }}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-subtrack-card text-sm font-semibold text-subtrack-text shadow-sm">
            100%
          </div>
        </div>
      </div>
    </section>
  );
}