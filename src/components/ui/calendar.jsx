import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";

import { cn } from "@/lib/utils";

const MONTH_OPTIONS = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
].map((label, value) => ({ label, value }));

function monthKey(date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function CalendarDropdown({ label, value, options, onChange, className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[90] mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-1.5 shadow-[var(--shadow-card)]">
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex h-10 w-full items-center rounded-xl px-3 text-left text-sm transition-colors ${
                  selected
                    ? "bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary-strong)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-panel)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CalendarHeader({
  month,
  startMonth,
  endMonth,
  onMonthChange,
}) {
  const yearOptions = useMemo(() => {
    const startYear = startMonth?.getFullYear() ?? month.getFullYear() - 10;
    const endYear = endMonth?.getFullYear() ?? month.getFullYear() + 10;

    return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
      const value = startYear + index;
      return { label: String(value), value };
    });
  }, [endMonth, month, startMonth]);

  const minMonthKey = startMonth ? monthKey(startMonth) : -Infinity;
  const maxMonthKey = endMonth ? monthKey(endMonth) : Infinity;
  const currentMonthKey = monthKey(month);

  const changeMonth = (nextMonth) => {
    const next = new Date(month.getFullYear(), nextMonth, 1);
    if (monthKey(next) < minMonthKey || monthKey(next) > maxMonthKey) return;
    onMonthChange?.(next);
  };

  const changeYear = (nextYear) => {
    const next = new Date(nextYear, month.getMonth(), 1);
    if (monthKey(next) < minMonthKey || monthKey(next) > maxMonthKey) return;
    onMonthChange?.(next);
  };

  const goPrevious = () => changeMonth(month.getMonth() - 1);
  const goNext = () => changeMonth(month.getMonth() + 1);
  const canGoPrevious = currentMonthKey > minMonthKey;
  const canGoNext = currentMonthKey < maxMonthKey;

  return (
    <div className="relative z-30 mb-3 grid grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-2">
      <button
        type="button"
        onClick={goPrevious}
        disabled={!canGoPrevious}
        aria-label="上一個月"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="grid min-w-0 grid-cols-2 gap-2">
        <CalendarDropdown
          label={String(month.getFullYear())}
          value={month.getFullYear()}
          options={yearOptions}
          onChange={changeYear}
        />
        <CalendarDropdown
          label={MONTH_OPTIONS[month.getMonth()].label}
          value={month.getMonth()}
          options={MONTH_OPTIONS}
          onChange={changeMonth}
        />
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={!canGoNext}
        aria-label="下一個月"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  month,
  defaultMonth,
  startMonth,
  endMonth,
  onMonthChange,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const useCustomDropdown = captionLayout === "dropdown";
  const displayMonth = month ?? defaultMonth ?? new Date();

  return (
    <div className={cn("w-fit", className)}>
      {useCustomDropdown && (
        <CalendarHeader
          month={displayMonth}
          startMonth={startMonth}
          endMonth={endMonth}
          onMonthChange={onMonthChange}
        />
      )}

      <DayPicker
        showOutsideDays={showOutsideDays}
        captionLayout={useCustomDropdown ? "label" : captionLayout}
        month={month}
        defaultMonth={defaultMonth}
        startMonth={startMonth}
        endMonth={endMonth}
        onMonthChange={onMonthChange}
        locale={zhTW}
        navLayout="after"
        className="p-0"
        classNames={{
          root: cn(defaultClassNames.root, "relative w-fit"),
          months: cn(defaultClassNames.months, "flex flex-col gap-4"),
          month: cn(defaultClassNames.month, "space-y-3"),
          month_caption: cn(
            defaultClassNames.month_caption,
            useCustomDropdown
              ? "sr-only"
              : "relative z-10 flex h-9 items-center justify-center px-10"
          ),
          caption_label: cn(
            defaultClassNames.caption_label,
            "relative z-10 inline-flex h-8 items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]"
          ),
          nav: cn(
            defaultClassNames.nav,
            useCustomDropdown
              ? "hidden"
              : "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between"
          ),
          button_previous: cn(
            defaultClassNames.button_previous,
            "pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          ),
          button_next: cn(
            defaultClassNames.button_next,
            "pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          ),
          chevron: cn(defaultClassNames.chevron, "h-4 w-4 fill-none"),
          dropdowns: cn(defaultClassNames.dropdowns, "flex items-center justify-center gap-2"),
          dropdown_root: cn(defaultClassNames.dropdown_root, "relative"),
          dropdown: cn(
            defaultClassNames.dropdown,
            "absolute inset-0 z-30 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 opacity-0 outline-none"
          ),
          months_dropdown: cn(defaultClassNames.months_dropdown, "min-w-20"),
          years_dropdown: cn(defaultClassNames.years_dropdown, "min-w-24"),
          month_grid: cn(defaultClassNames.month_grid, "w-full border-collapse"),
          weekdays: cn(defaultClassNames.weekdays, "flex"),
          weekday: cn(
            defaultClassNames.weekday,
            "flex h-8 w-9 items-center justify-center text-xs font-medium text-[var(--color-text-muted)]"
          ),
          weeks: cn(defaultClassNames.weeks, "flex flex-col gap-1"),
          week: cn(defaultClassNames.week, "flex w-full gap-1"),
          day: cn(defaultClassNames.day, "h-9 w-9 p-0 text-center text-sm"),
          day_button: cn(
            defaultClassNames.day_button,
            "flex h-9 w-9 items-center justify-center rounded-full text-sm tabular-nums text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          ),
          selected: cn(
            defaultClassNames.selected,
            "[&>button]:bg-[var(--color-primary)] [&>button]:font-semibold [&>button]:text-white [&>button]:hover:bg-[var(--color-primary-strong)] [&>button]:hover:text-white"
          ),
          today: cn(
            defaultClassNames.today,
            "[&>button]:border [&>button]:border-[var(--color-primary)] [&>button]:font-semibold [&>button]:text-[var(--color-primary-strong)]"
          ),
          outside: cn(
            defaultClassNames.outside,
            "[&>button]:text-[var(--color-text-muted)] [&>button]:opacity-45"
          ),
          disabled: cn(
            defaultClassNames.disabled,
            "[&>button]:pointer-events-none [&>button]:opacity-35"
          ),
          hidden: cn(defaultClassNames.hidden, "invisible"),
          ...classNames,
        }}
        components={{
          Chevron: ({ orientation, className: iconClassName }) =>
            orientation === "left" ? (
              <ChevronLeft className={cn("h-4 w-4", iconClassName)} />
            ) : orientation === "down" ? (
              <ChevronDown className={cn("h-4 w-4", iconClassName)} />
            ) : (
              <ChevronRight className={cn("h-4 w-4", iconClassName)} />
            ),
        }}
        {...props}
      />
    </div>
  );
}
