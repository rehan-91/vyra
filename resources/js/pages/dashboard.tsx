import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import type { DashboardInvitation } from '@/types';

type Props = {
    pendingInvitations?: DashboardInvitation[];
};

export default function Dashboard({ pendingInvitations = [] }: Props) {
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    return (
        <>
            <Head title="Dashboard" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-4 sm:p-6">
                <header className="border-border bg-card relative overflow-hidden rounded-2xl border px-5 py-6 shadow-[0_24px_70px_-48px_rgb(0_0_0)] sm:px-7">
                    <div
                        aria-hidden="true"
                        className="via-primary/70 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
                    />
                    <p className="text-primary text-[10px] font-semibold tracking-[0.2em] uppercase">
                        VYRA
                    </p>
                    <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight">
                        Workspace overview
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
                        Your team workspace is ready for the creator tools you
                        choose to build next.
                    </p>
                </header>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border bg-card/75 relative aspect-video overflow-hidden rounded-2xl border shadow-[inset_0_1px_0_rgb(255_255_255_/_0.03)]">
                        <PlaceholderPattern className="stroke-primary/15 absolute inset-0 size-full" />
                    </div>
                    <div className="border-sidebar-border bg-card/75 relative aspect-video overflow-hidden rounded-2xl border shadow-[inset_0_1px_0_rgb(255_255_255_/_0.03)]">
                        <PlaceholderPattern className="stroke-primary/15 absolute inset-0 size-full" />
                    </div>
                    <div className="border-sidebar-border bg-card/75 relative aspect-video overflow-hidden rounded-2xl border shadow-[inset_0_1px_0_rgb(255_255_255_/_0.03)]">
                        <PlaceholderPattern className="stroke-primary/15 absolute inset-0 size-full" />
                    </div>
                </div>
                <div className="border-sidebar-border bg-card/60 relative min-h-[50vh] flex-1 overflow-hidden rounded-2xl border md:min-h-min">
                    <PlaceholderPattern className="stroke-primary/12 absolute inset-0 size-full" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
