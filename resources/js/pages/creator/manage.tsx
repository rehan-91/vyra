import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ButtonLoading, loadingMessages } from '@/components/ui/loading';
import CreatorProfileFields from '@/features/creator/components/creator-profile-fields';
import CreatorProfileSettingsFields from '@/features/creator/components/creator-profile-settings-fields';
import type { CreatorIdentity } from '@/features/creator/types';

type Props = {
    creator: CreatorIdentity;
};

export default function ManageCreator({ creator }: Props) {
    return (
        <>
            <Head title="Creator identity" />

            <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-8 sm:px-0 sm:py-12">
                <Heading
                    title="Creator identity"
                    description="Manage the independent identity that will own your future VYRA resources."
                />

                <div className="border-border bg-card relative overflow-hidden rounded-2xl border p-5 shadow-[0_24px_70px_-44px_rgb(0_0_0)] sm:p-7">
                    <div
                        aria-hidden="true"
                        className="via-primary/70 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
                    />
                    <Form
                        action={`/creator/${creator.id}`}
                        method="patch"
                        className="space-y-6"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <CreatorProfileFields
                                    creator={creator}
                                    errors={errors}
                                />
                                <CreatorProfileSettingsFields
                                    creator={creator}
                                    errors={errors}
                                />

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p
                                        className="text-muted-foreground text-xs leading-5"
                                        aria-live="polite"
                                    >
                                        {recentlySuccessful
                                            ? 'Creator profile saved.'
                                            : creator.profileVisibility ===
                                                'public'
                                              ? 'Your public profile is live.'
                                              : 'Your profile is private until you publish it.'}
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-creator-button"
                                    >
                                        <ButtonLoading
                                            isLoading={processing}
                                            loadingLabel={
                                                loadingMessages.saving
                                            }
                                        >
                                            Save creator profile
                                        </ButtonLoading>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <div className="border-border bg-muted/30 rounded-2xl border p-5 sm:p-6">
                    <p className="text-xs font-semibold tracking-[0.14em] uppercase">
                        Public profile
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                        {creator.profileVisibility === 'public'
                            ? 'This is the link your audience can visit.'
                            : 'Publish your profile to make this link available to your audience.'}
                    </p>
                    {creator.profileVisibility === 'public' ? (
                        <a
                            href={creator.publicUrl}
                            className="text-primary mt-3 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
                        >
                            @{creator.handle}
                        </a>
                    ) : (
                        <p className="text-muted-foreground mt-3 text-sm">
                            @{creator.handle}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

ManageCreator.layout = (props: Props) => ({
    breadcrumbs: [
        {
            title: props.creator.displayName,
            href: `/creator/${props.creator.id}/manage`,
        },
    ],
});
