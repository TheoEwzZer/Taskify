"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  HTMLAttributes,
  ReactElement,
  TableHTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  DayPicker,
  labelNext,
  labelPrevious,
  useDayPicker,
  type DayPickerProps,
} from "react-day-picker";

export type CalendarProps = DayPickerProps & {
  yearRange?: number;

  showYearSwitcher?: boolean;

  monthsClassName?: string;
  monthCaptionClassName?: string;
  weekdaysClassName?: string;
  weekdayClassName?: string;
  monthClassName?: string;
  captionClassName?: string;
  captionLabelClassName?: string;
  buttonNextClassName?: string;
  buttonPreviousClassName?: string;
  navClassName?: string;
  monthGridClassName?: string;
  weekClassName?: string;
  dayClassName?: string;
  dayButtonClassName?: string;
  rangeStartClassName?: string;
  rangeEndClassName?: string;
  selectedClassName?: string;
  todayClassName?: string;
  outsideClassName?: string;
  disabledClassName?: string;
  rangeMiddleClassName?: string;
  hiddenClassName?: string;
};

function Calendar({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  ...props
}: CalendarProps): ReactElement {
  const [navView, setNavView] = useState<"days" | "years">("days");
  const [displayYears, setDisplayYears] = useState<{
    from: number;
    to: number;
  }>(
    useMemo((): { from: number; to: number } => {
      const currentYear: number = new Date().getFullYear();
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      };
    }, [yearRange])
  );

  const { onNextClick, onPrevClick, startMonth, endMonth } = props;

  const columnsDisplayed: number | undefined =
    navView === "years" ? 1 : numberOfMonths;

  const _monthsClassName: string = cn("relative flex", props.monthsClassName);
  const _monthCaptionClassName: string = cn(
    "relative mx-10 flex h-7 items-center justify-center",
    props.monthCaptionClassName
  );
  const _weekdaysClassName: string = cn(
    "flex flex-row",
    props.weekdaysClassName
  );
  const _weekdayClassName: string = cn(
    "w-8 text-sm font-normal text-muted-foreground",
    props.weekdayClassName
  );
  const _monthClassName: string = cn("w-full", props.monthClassName);
  const _captionClassName: string = cn(
    "relative flex items-center justify-center pt-1",
    props.captionClassName
  );
  const _captionLabelClassName: string = cn(
    "truncate text-sm font-medium",
    props.captionLabelClassName
  );
  const buttonNavClassName: string = buttonVariants({
    variant: "outline",
    className:
      "absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
  });
  const _buttonNextClassName: string = cn(
    buttonNavClassName,
    "right-0",
    props.buttonNextClassName
  );
  const _buttonPreviousClassName: string = cn(
    buttonNavClassName,
    "left-0",
    props.buttonPreviousClassName
  );
  const _navClassName: string = cn("flex items-start", props.navClassName);
  const _monthGridClassName: string = cn(
    "mx-auto mt-4",
    props.monthGridClassName
  );
  const _weekClassName: string = cn(
    "mt-2 flex w-max items-start",
    props.weekClassName
  );
  const _dayClassName: string = cn(
    "flex size-8 flex-1 items-center justify-center p-0 text-sm",
    props.dayClassName
  );
  const _dayButtonClassName: string = cn(
    buttonVariants({ variant: "ghost" }),
    "size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100",
    props.dayButtonClassName
  );
  const buttonRangeClassName =
    "bg-accent [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground";
  const _rangeStartClassName: string = cn(
    buttonRangeClassName,
    "day-range-start rounded-s-md",
    props.rangeStartClassName
  );
  const _rangeEndClassName: string = cn(
    buttonRangeClassName,
    "day-range-end rounded-e-md",
    props.rangeEndClassName
  );
  const _rangeMiddleClassName: string = cn(
    "bg-accent !text-foreground [&>button]:bg-transparent [&>button]:!text-foreground [&>button]:hover:bg-transparent [&>button]:hover:!text-foreground",
    props.rangeMiddleClassName
  );
  const _selectedClassName: string = cn(
    "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
    props.selectedClassName
  );
  const _todayClassName: string = cn(
    "[&>button]:bg-accent [&>button]:text-accent-foreground",
    props.todayClassName
  );
  const _outsideClassName: string = cn(
    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
    props.outsideClassName
  );
  const _disabledClassName: string = cn(
    "text-muted-foreground opacity-50",
    props.disabledClassName
  );
  const _hiddenClassName: string = cn(
    "invisible flex-1",
    props.hiddenClassName
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      style={{
        width: 248.8 * (columnsDisplayed ?? 1) + "px",
      }}
      classNames={{
        months: _monthsClassName,
        month_caption: _monthCaptionClassName,
        weekdays: _weekdaysClassName,
        weekday: _weekdayClassName,
        month: _monthClassName,
        caption: _captionClassName,
        caption_label: _captionLabelClassName,
        button_next: _buttonNextClassName,
        button_previous: _buttonPreviousClassName,
        nav: _navClassName,
        month_grid: _monthGridClassName,
        week: _weekClassName,
        day: _dayClassName,
        day_button: _dayButtonClassName,
        range_start: _rangeStartClassName,
        range_middle: _rangeMiddleClassName,
        range_end: _rangeEndClassName,
        selected: _selectedClassName,
        today: _todayClassName,
        outside: _outsideClassName,
        disabled: _disabledClassName,
        hidden: _hiddenClassName,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
        Nav: ({ className }) => {
          const { nextMonth, previousMonth, goToMonth } = useDayPicker();

          const isPreviousDisabled: boolean | undefined = (():
            | boolean
            | undefined => {
            if (navView === "years") {
              return (
                (startMonth &&
                  differenceInCalendarDays(
                    new Date(displayYears.from - 1, 0, 1),
                    startMonth
                  ) < 0) ||
                (endMonth &&
                  differenceInCalendarDays(
                    new Date(displayYears.from - 1, 0, 1),
                    endMonth
                  ) > 0)
              );
            }
            return !previousMonth;
          })();

          const isNextDisabled: boolean | undefined = (():
            | boolean
            | undefined => {
            if (navView === "years") {
              return (
                (startMonth &&
                  differenceInCalendarDays(
                    new Date(displayYears.to + 1, 0, 1),
                    startMonth
                  ) < 0) ||
                (endMonth &&
                  differenceInCalendarDays(
                    new Date(displayYears.to + 1, 0, 1),
                    endMonth
                  ) > 0)
              );
            }
            return !nextMonth;
          })();

          const handlePreviousClick: () => void = useCallback((): void => {
            if (!previousMonth) return;
            if (navView === "years") {
              setDisplayYears(
                (prev: {
                  from: number;
                  to: number;
                }): { from: number; to: number } => ({
                  from: prev.from - (prev.to - prev.from + 1),
                  to: prev.to - (prev.to - prev.from + 1),
                })
              );
              onPrevClick?.(
                new Date(
                  displayYears.from - (displayYears.to - displayYears.from),
                  0,
                  1
                )
              );
              return;
            }
            goToMonth(previousMonth);
            onPrevClick?.(previousMonth);
          }, [previousMonth, goToMonth]);

          const handleNextClick: () => void = useCallback((): void => {
            if (!nextMonth) return;
            if (navView === "years") {
              setDisplayYears(
                (prev: {
                  from: number;
                  to: number;
                }): { from: number; to: number } => ({
                  from: prev.from + (prev.to - prev.from + 1),
                  to: prev.to + (prev.to - prev.from + 1),
                })
              );
              onNextClick?.(
                new Date(
                  displayYears.from + (displayYears.to - displayYears.from),
                  0,
                  1
                )
              );
              return;
            }
            goToMonth(nextMonth);
            onNextClick?.(nextMonth);
          }, [goToMonth, nextMonth]);
          return (
            <nav className={cn("flex items-center", className)}>
              <Button
                variant="outline"
                className="absolute left-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                type="button"
                tabIndex={isPreviousDisabled ? undefined : -1}
                disabled={isPreviousDisabled}
                aria-label={
                  navView === "years"
                    ? `Go to the previous ${
                        displayYears.to - displayYears.from + 1
                      } years`
                    : labelPrevious(previousMonth)
                }
                onClick={handlePreviousClick}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="absolute right-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                type="button"
                tabIndex={isNextDisabled ? undefined : -1}
                disabled={isNextDisabled}
                aria-label={
                  navView === "years"
                    ? `Go to the next ${
                        displayYears.to - displayYears.from + 1
                      } years`
                    : labelNext(nextMonth)
                }
                onClick={handleNextClick}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          );
        },
        CaptionLabel: ({
          children,
          ...props
        }: HTMLAttributes<HTMLSpanElement>): ReactElement => {
          if (!showYearSwitcher) return <span {...props}>{children}</span>;
          return (
            <Button
              className="h-7 w-full truncate text-sm font-medium"
              variant="ghost"
              size="sm"
              onClick={(): void =>
                setNavView((prev: "days" | "years"): "days" | "years" =>
                  prev === "days" ? "years" : "days"
                )
              }
            >
              {navView === "days"
                ? children
                : displayYears.from + " - " + displayYears.to}
            </Button>
          );
        },
        MonthGrid: ({
          className,
          children,
          ...props
        }: TableHTMLAttributes<HTMLTableElement>): ReactElement => {
          const { goToMonth, selected } = useDayPicker();
          if (navView === "years") {
            return (
              <div
                className={cn("grid grid-cols-4 gap-y-2", className)}
                {...props}
              >
                {Array.from(
                  { length: displayYears.to - displayYears.from + 1 },
                  (_: unknown, i: number): ReactElement => {
                    const isBefore: boolean =
                      differenceInCalendarDays(
                        new Date(displayYears.from + i, 11, 31),
                        startMonth!
                      ) < 0;

                    const isAfter: boolean =
                      differenceInCalendarDays(
                        new Date(displayYears.from + i, 0, 0),
                        endMonth!
                      ) > 0;

                    const isDisabled: boolean = isBefore || isAfter;
                    return (
                      <Button
                        key={i}
                        className={cn(
                          "text-foreground h-7 w-full text-sm font-normal",
                          displayYears.from + i === new Date().getFullYear() &&
                            "bg-accent text-accent-foreground font-medium"
                        )}
                        variant="ghost"
                        onClick={(): void => {
                          setNavView("days");
                          goToMonth(
                            new Date(
                              displayYears.from + i,
                              (selected as Date | undefined)?.getMonth() ?? 0
                            )
                          );
                        }}
                        disabled={navView === "years" ? isDisabled : undefined}
                      >
                        {displayYears.from + i}
                      </Button>
                    );
                  }
                )}
              </div>
            );
          }
          return (
            <table
              className={className}
              {...props}
            >
              {children}
            </table>
          );
        },
      }}
      numberOfMonths={columnsDisplayed}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
