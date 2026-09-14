import {
    DayPicker,
    type MonthCaptionProps,
    useDayPicker,
} from 'react-day-picker';
import 'react-day-picker/style.css';
import type * as React from 'react';

import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const months = Array.from({ length: 12 }, (_, month) => ({
    value: month,
    label: new Intl.DateTimeFormat('en', { month: 'long' }).format(
        new Date(2000, month, 1),
    ),
}));

function CalendarCaption({
    calendarMonth,
    displayIndex: _displayIndex,
    className,
    ...props
}: MonthCaptionProps) {
    const { dayPickerProps, goToMonth } = useDayPicker();
    const { startMonth, endMonth } = dayPickerProps;
    const selectedYear = calendarMonth.date.getFullYear();
    const selectedMonth = calendarMonth.date.getMonth();
    const firstYear = startMonth?.getFullYear() ?? selectedYear - 100;
    const lastYear = endMonth?.getFullYear() ?? selectedYear;
    const years = Array.from(
        { length: lastYear - firstYear + 1 },
        (_, index) => lastYear - index,
    );

    const isUnavailableMonth = (month: number) => {
        const candidate = new Date(selectedYear, month, 1);

        return (
            (startMonth && candidate < new Date(startMonth.getFullYear(), startMonth.getMonth(), 1)) ||
            (endMonth && candidate > new Date(endMonth.getFullYear(), endMonth.getMonth(), 1))
        );
    };

    return (
        <div
            {...props}
            className={cn(
                'rdp-month_caption flex items-center justify-center gap-1.5',
                className,
            )}
        >
            <Select
                value={String(selectedMonth)}
                onValueChange={(value) =>
                    goToMonth(new Date(selectedYear, Number(value), 1))
                }
            >
                <SelectTrigger
                    aria-label="Choose month"
                    className="h-9 border-0 bg-transparent px-2 text-sm font-semibold shadow-none hover:bg-accent"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {months.map((month) => (
                        <SelectItem
                            key={month.value}
                            value={String(month.value)}
                            disabled={isUnavailableMonth(month.value)}
                        >
                            {month.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                value={String(selectedYear)}
                onValueChange={(value) =>
                    goToMonth(new Date(Number(value), selectedMonth, 1))
                }
            >
                <SelectTrigger
                    aria-label="Choose year"
                    className="h-9 border-0 bg-transparent px-2 text-sm font-semibold shadow-none hover:bg-accent"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function Calendar({
    className,
    classNames,
    ...props
}: React.ComponentProps<typeof DayPicker>) {
    return (
        <DayPicker
            hideNavigation
            captionLayout="label"
            components={{
                MonthCaption: CalendarCaption,
            }}
            className={cn(
                'rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-[0_24px_60px_-24px_rgb(0_0_0_/_0.8)] sm:p-2 [--rdp-accent-color:var(--primary)] [--rdp-accent-background-color:var(--accent)] [--rdp-day_button-border-radius:0.625rem] [--rdp-day_button-height:2.5rem] [--rdp-day_button-width:2.5rem] [--rdp-day-height:2.5rem] [--rdp-day-width:2.5rem]',
                className,
            )}
            classNames={{
                month_caption:
                    'rdp-month_caption items-center justify-center text-sm',
                dropdown:
                    'rdp-dropdown bg-transparent text-sm text-foreground outline-none',
                dropdowns: 'rdp-dropdowns gap-2',
                weekday: 'rdp-weekday text-muted-foreground text-xs font-medium',
                day_button:
                    'rdp-day_button rounded-lg text-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover',
                selected:
                    'rdp-selected [&_.rdp-day_button]:border-primary [&_.rdp-day_button]:bg-primary [&_.rdp-day_button]:text-primary-foreground hover:[&_.rdp-day_button]:bg-zenith-primary-hover',
                today: 'rdp-today [&_.rdp-day_button]:text-primary',
                disabled:
                    'rdp-disabled text-muted-foreground opacity-40 [&_.rdp-day_button]:cursor-not-allowed',
                outside: 'rdp-outside text-muted-foreground opacity-40',
                ...classNames,
            }}
            {...props}
        />
    );
}

export { Calendar };
