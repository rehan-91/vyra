import type * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

const loadingMessages = {
    account: 'Getting your account ready…',
    dashboard: 'Getting things ready…',
    profile: 'Loading your profile…',
    creatorProfile: 'Loading creator profile…',
    conversations: 'Loading your conversations…',
    products: 'Loading your products…',
    orders: 'Loading your orders…',
    members: 'Loading your members…',
    saving: 'Saving your changes…',
    creatingProfile: 'Creating your profile…',
    uploading: 'Uploading your file…',
    processing: 'Processing your request…',
    signingIn: 'Signing you in…',
    creatingAccount: 'Creating your account…',
    navigating: 'Taking you there…',
    generic: 'Just a moment…',
} as const;

const loadingProgressColor = '#f23fa5';

type LoaderProps = React.ComponentProps<'div'> & {
    message?: string;
};

function PageLoader({
    className,
    message = loadingMessages.generic,
    ...props
}: LoaderProps) {
    return (
        <div
            {...props}
            data-slot="page-loader"
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={cn(
                'flex min-h-[16rem] w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center text-sm text-muted-foreground',
                className,
            )}
        >
            <Spinner className="size-6 text-primary" />
            <p>{message}</p>
        </div>
    );
}

function SectionLoader({
    className,
    message = loadingMessages.generic,
    ...props
}: LoaderProps) {
    return (
        <div
            {...props}
            data-slot="section-loader"
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={cn(
                'flex min-h-28 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground',
                className,
            )}
        >
            <Spinner className="size-5 text-primary" />
            <p>{message}</p>
        </div>
    );
}

type InlineLoaderProps = React.ComponentProps<'span'> & {
    label?: string;
    showLabel?: boolean;
};

function InlineLoader({
    className,
    label = loadingMessages.generic,
    showLabel = false,
    ...props
}: InlineLoaderProps) {
    return (
        <span
            {...props}
            data-slot="inline-loader"
            role="status"
            aria-live="polite"
            className={cn(
                'inline-flex items-center gap-2 text-sm text-muted-foreground',
                className,
            )}
        >
            <Spinner className="size-4 text-primary" />
            <span className={showLabel ? undefined : 'sr-only'}>{label}</span>
        </span>
    );
}

type ButtonLoadingProps = {
    children: React.ReactNode;
    isLoading: boolean;
    loadingLabel: string;
};

function ButtonLoading({
    children,
    isLoading,
    loadingLabel,
}: ButtonLoadingProps) {
    if (!isLoading) {
        return children;
    }

    return (
        <span
            data-slot="button-loading"
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2"
        >
            <Spinner />
            <span>{loadingLabel}</span>
        </span>
    );
}

export {
    ButtonLoading,
    InlineLoader,
    PageLoader,
    SectionLoader,
    Skeleton,
    loadingMessages,
    loadingProgressColor,
};
