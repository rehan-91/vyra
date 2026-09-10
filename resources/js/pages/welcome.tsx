import { Head } from '@inertiajs/react';
import CreatorOsZenithHomepage from '@/features/home/creator-os-zenith-homepage';

export default function Welcome() {
    return (
        <>
            <Head title="VYRA — Obsidian Electric Magenta Edition">
                <meta
                    name="description"
                    content="VYRA is a premium operating system for independent creators."
                />
            </Head>
            <CreatorOsZenithHomepage />
        </>
    );
}
