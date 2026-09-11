import { Head } from '@inertiajs/react';
import { ExternalLink, Globe2, Instagram, Music2, Youtube } from 'lucide-react';
import VyraLogo from '@/components/vyra-logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Props = {
    creator: {
        handle: string;
        displayName: string;
        bio: string | null;
        socialLinks: Record<string, string>;
    };
};

const socialIcons = {
    website: Globe2,
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music2,
    x: ExternalLink,
};

export default function PublicCreatorProfile({ creator }: Props) {
    const initial = creator.displayName.trim().charAt(0).toUpperCase();

    return (
        <>
            <Head title={`${creator.displayName} (@${creator.handle})`} />

            <main className="bg-background min-h-screen px-4 py-4 sm:px-6 sm:py-8">
                <div className="mx-auto max-w-4xl">
                    <header className="flex items-center justify-between py-3">
                        <a
                            href="/"
                            aria-label="VYRA home"
                            className="inline-flex min-h-11 items-center"
                        >
                            <VyraLogo className="h-7 w-auto" />
                        </a>
                        <span className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
                            Creator profile
                        </span>
                    </header>

                    <section className="border-border bg-card relative mt-5 overflow-hidden rounded-3xl border shadow-[0_28px_90px_-56px_rgb(0_0_0)]">
                        <div
                            aria-hidden="true"
                            className="from-primary/80 via-primary/25 to-background h-36 bg-gradient-to-br sm:h-48"
                        />
                        <div className="relative px-5 pb-7 sm:px-9 sm:pb-10">
                            <Avatar className="ring-background -mt-12 size-24 border-4 ring-4 sm:-mt-16 sm:size-32">
                                <AvatarFallback className="from-primary/90 to-primary text-primary-foreground bg-gradient-to-br text-3xl font-semibold sm:text-4xl">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>

                            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="max-w-2xl">
                                    <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-5xl">
                                        {creator.displayName}
                                    </h1>
                                    <p className="text-primary mt-1.5 text-sm font-medium">
                                        @{creator.handle}
                                    </p>
                                    {creator.bio && (
                                        <p className="text-muted-foreground mt-5 text-sm leading-7 whitespace-pre-line sm:text-base">
                                            {creator.bio}
                                        </p>
                                    )}
                                </div>

                                {Object.keys(creator.socialLinks).length >
                                    0 && (
                                    <nav
                                        aria-label={`${creator.displayName}'s links`}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {Object.entries(
                                            creator.socialLinks,
                                        ).map(([name, url]) => {
                                            const Icon =
                                                socialIcons[
                                                    name as keyof typeof socialIcons
                                                ] ?? ExternalLink;

                                            return (
                                                <a
                                                    key={name}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="border-border hover:bg-accent focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-full border transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                                                    aria-label={`${creator.displayName} on ${name}`}
                                                >
                                                    <Icon className="size-4" />
                                                </a>
                                            );
                                        })}
                                    </nav>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="border-border bg-card mt-5 rounded-3xl border p-6 sm:p-9">
                        <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
                            Coming soon
                        </p>
                        <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight">
                            This creator’s VYRA space is taking shape.
                        </h2>
                        <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-6">
                            Offers and creator content will appear here when
                            they are ready. There are no products to browse yet.
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
