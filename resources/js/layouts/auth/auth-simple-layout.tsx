import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="bg-background relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-5 md:p-10">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(212,175,55,.18),transparent_25rem),radial-gradient(circle_at_8%_88%,rgba(112,88,168,.12),transparent_30rem)]"
            />
            <div className="border-border/80 bg-card/95 relative w-full max-w-md border p-7 shadow-[0_32px_100px_-42px_rgb(0_0_0)] backdrop-blur-sm sm:rounded-2xl sm:p-9">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-3 font-medium"
                        >
                            <div className="border-primary/45 bg-primary/10 text-primary group-hover:bg-primary/15 mb-1 flex h-11 w-11 items-center justify-center rounded-xl border transition-colors">
                                <AppLogoIcon className="size-7 fill-current" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <p className="text-primary text-[10px] font-semibold tracking-[0.2em] uppercase">
                                Creator OS
                            </p>
                            <h1 className="text-foreground font-serif text-3xl font-medium tracking-tight">
                                {title}
                            </h1>
                            <p className="text-muted-foreground text-center text-sm leading-6">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
