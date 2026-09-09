import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import CreatorProfileFields from '@/features/creator/components/creator-profile-fields';
import type { CreatorIdentity } from '@/features/creator/types';

type Props = {
    creator: CreatorIdentity;
};

export default function ManageCreator({ creator }: Props) {
    return (
        <>
            <Head title="Creator identity" />

            <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-6 sm:px-0 sm:py-10">
                <Heading
                    title="Creator identity"
                    description="Manage the independent identity that will own your future Creator OS resources."
                />

                <div className="bg-card rounded-xl border p-5 shadow-sm sm:p-6">
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

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p
                                        className="text-muted-foreground text-xs"
                                        aria-live="polite"
                                    >
                                        {recentlySuccessful
                                            ? 'Creator profile saved.'
                                            : 'Your Creator is not owned by a Team.'}
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-creator-button"
                                    >
                                        {processing
                                            ? 'Saving…'
                                            : 'Save creator profile'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
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
