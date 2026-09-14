import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function Calendar({
    className,
    classNames,
    ...props
}: React.ComponentProps<typeof DayPicker>) {
    return (
        <DayPicker
            className={cn(
                'rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-[0_24px_60px_-24px_rgb(0_0_0_/_0.8)] sm:p-2 [--rdp-accent-color:var(--primary)] [--rdp-accent-background-color:var(--accent)] [--rdp-day_button-border-radius:0.625rem] [--rdp-day_button-height:2.5rem] [--rdp-day_button-width:2.5rem] [--rdp-day-height:2.5rem] [--rdp-day-width:2.5rem] [--rdp-nav_button-height:2.5rem] [--rdp-nav_button-width:2.5rem]',
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
