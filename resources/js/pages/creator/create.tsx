import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import CreatorProfileFields from '@/features/creator/components/creator-profile-fields';

export default function CreateCreator() {
    return (
        <>
            <Head title="Create creator identity" />

            <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-6 sm:px-0 sm:py-10">
                <Heading
                    title="Create your creator identity"
                    description="This is the identity that future Creator OS tools will belong to. It is separate from your team workspace."
                />

                <div className="bg-card rounded-xl border p-5 shadow-sm sm:p-6">
                    <Form action="/creator" method="post" className="space-y-6">
                        {({ errors, processing }) => (
                            <>
                                <CreatorProfileFields errors={errors} />

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-muted-foreground text-xs">
                                        You can refine these details later.
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="create-creator-button"
                                    >
                                        {processing
                                            ? 'Creating identity…'
                                            : 'Create creator identity'}
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

CreateCreator.layout = {
    breadcrumbs: [
        {
            title: 'Creator identity',
            href: '/creator/create',
        },
    ],
};
