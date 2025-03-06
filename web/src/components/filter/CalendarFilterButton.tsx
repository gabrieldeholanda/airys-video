import {
  useFormattedRange,
  useFormattedTimestamp,
} from "@/hooks/use-date-utils";
import { RecordingsSummary, ReviewSummary } from "@/types/review";
import { Button } from "../ui/button";
import { FaCalendarAlt } from "react-icons/fa";
import ReviewActivityCalendar from "../overlay/ReviewActivityCalendar";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { isMobile } from "react-device-detect";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DateRangePicker } from "../ui/calendar-range";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import PlatformAwareDialog from "../overlay/dialog/PlatformAwareDialog";
import { useTranslation } from "react-i18next";

type CalendarFilterButtonProps = {
  reviewSummary?: ReviewSummary;
  recordingsSummary?: RecordingsSummary;
  day?: Date;
  updateSelectedDay: (day?: Date) => void;
};
export default function CalendarFilterButton({
  reviewSummary,
  recordingsSummary,
  day,
  updateSelectedDay,
}: CalendarFilterButtonProps) {
  const [open, setOpen] = useState(false);
  const { t: translate } = useTranslation(['ui']);
  const { t: commonTranslate } = useTranslation(['common']);
  const selectedDate = useFormattedTimestamp(
    day == undefined ? 0 : day?.getTime() / 1000 + 1,
    "%b %-d",
  );

  const trigger = (
    <Button
      className="flex items-center gap-2"
      aria-label={translate('filter.calendar.button.label')}
      variant={day == undefined ? "default" : "select"}
      size="sm"
    >
      <FaCalendarAlt
        className={`${day == undefined ? "text-secondary-foreground" : "text-selected-foreground"}`}
      />
      <div
        className={`hidden md:block ${day == undefined ? "text-primary" : "text-selected-foreground"}`}
      >
        {day == undefined ? translate('filter.calendar.button.default') : selectedDate}
      </div>
    </Button>
  );
  const content = (
    <>
      <ReviewActivityCalendar
        reviewSummary={reviewSummary}
        recordingsSummary={recordingsSummary}
        selectedDay={day}
        onSelect={updateSelectedDay}
      />
      <DropdownMenuSeparator />
      <div className="flex items-center justify-center p-2">
        <Button
          aria-label={commonTranslate('reset')}
          onClick={() => {
            updateSelectedDay(undefined);
          }}
        >
          {commonTranslate('reset')}
        </Button>
      </div>
    </>
  );

  return (
    <PlatformAwareDialog
      trigger={trigger}
      content={content}
      contentClassName="w-auto"
      open={open}
      onOpenChange={setOpen}
    />
  );
}

type CalendarRangeFilterButtonProps = {
  range?: DateRange;
  updateSelectedRange: (range?: DateRange) => void;
};
export function CalendarRangeFilterButton({
  range,
  updateSelectedRange,
}: CalendarRangeFilterButtonProps) {
  const [open, setOpen] = useState(false);
  const { t: translate } = useTranslation(['ui']);

  const selectedDate = useFormattedRange(
    range?.from == undefined ? 0 : range.from.getTime() / 1000 + 1,
    range?.to == undefined ? 0 : range.to.getTime() / 1000 - 1,
    "%b %-d",
  );

  const trigger = (
    <Button
      className="flex items-center gap-2"
      aria-label={translate('filter.calendar.button.label')}
      variant={range == undefined ? "default" : "select"}
      size="sm"
    >
      <FaCalendarAlt
        className={`${range == undefined ? "text-secondary-foreground" : "text-selected-foreground"}`}
      />
      <div
        className={`${range == undefined ? "text-primary" : "text-selected-foreground"}`}
      >
        {range == undefined ? translate('filter.calendar.button.range.default') : translate('filter.calendar.button.range.selected', { date: selectedDate })}
      </div>
    </Button>
  );
  const content = (
    <>
      <DateRangePicker
        initialDateFrom={range?.from}
        initialDateTo={range?.to}
        showCompare={false}
        onUpdate={(range) => {
          updateSelectedRange(range.range);
          setOpen(false);
        }}
        onReset={() => updateSelectedRange(undefined)}
      />
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>{content}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto">{content}</PopoverContent>
    </Popover>
  );
}
