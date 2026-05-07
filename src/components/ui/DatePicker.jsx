import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function parseDateValue(value) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function formatValue(date) {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDisplay(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${year} / ${month} / ${day}`;
}

export default function DatePicker({
  value,
  onChange,
  variant = "white",
  hasError = false,
  placeholder = "選擇日期",
  placement = "bottom",
  "aria-labelledby": ariaLabelledby,
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(selectedDate ?? today);

  const triggerClass = `w-full flex items-center justify-between px-4 text-sm text-slate-700 focus:outline-none transition-colors rounded-xl ${
    variant === "white"
      ? `bg-white border py-2.5 ${hasError ? "border-red-400" : "border-slate-200"}`
      : `bg-slate-100 border-0 py-3`
  }`;

  const popoverSide = placement === "top" ? "top" : "bottom";
  const popoverAlign = placement === "center" ? "center" : "start";

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setMonth(selectedDate ?? today);
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-labelledby={ariaLabelledby}
          className={triggerClass}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span className={value ? "text-slate-700" : "text-slate-300"}>
            {value ? formatDisplay(value) : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={popoverAlign}
        side={popoverSide}
        sideOffset={8}
        className="w-auto overflow-hidden p-3"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          month={month}
          onMonthChange={setMonth}
          defaultMonth={selectedDate ?? today}
          captionLayout="dropdown"
          startMonth={new Date(today.getFullYear() - 10, 0)}
          endMonth={new Date(today.getFullYear() + 10, 11)}
          onSelect={(date) => {
            if (!date) return;
            onChange(formatValue(date));
            setOpen(false);
          }}
        />

        <div className="mt-3 border-t border-[var(--color-border)] pt-2.5 text-center">
          <button
            type="button"
            onClick={() => {
              setMonth(today);
              onChange(formatValue(today));
              setOpen(false);
            }}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-strong)] transition-colors hover:bg-[var(--color-primary-soft)]"
          >
            今天
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
