import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreatorIdentity } from '@/features/creator/types';

type Props = {
    creator: CreatorIdentity;
    errors: Record<string, string | undefined>;
};

const socialFields = [
    ['website', 'Website', 'https://your-site.com'],
    ['instagram', 'Instagram', 'https://instagram.com/yourhandle'],
    ['youtube', 'YouTube', 'https://youtube.com/@yourhandle'],
    ['tiktok', 'TikTok', 'https://tiktok.com/@yourhandle'],
    ['x', 'X', 'https://x.com/yourhandle'],
] as const;

export default function CreatorProfileSettingsFields({
    creator,
    errors,
}: Props) {
    return (
        <div className="space-y-8 border-t pt-7">
            <section className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold">
                        Profile visibility
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                        Private profiles stay visible only to you. Publish when
                        you are ready to share your VYRA profile.
                    </p>
                </div>

                <div className="grid gap-2.5">
                    <Label htmlFor="profile_visibility">Visibility</Label>
                    <select
                        id="profile_visibility"
                        name="profile_visibility"
                        defaultValue={creator.profileVisibility}
                        className="border-input bg-card focus-visible:border-ring focus-visible:ring-ring/30 h-10 rounded-xl border px-3.5 text-sm shadow-[inset_0_1px_0_rgb(255_255_255_/_0.025)] outline-none focus-visible:ring-[3px]"
                    >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                    <InputError message={errors.profile_visibility} />
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold">Links</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                        Add the places where your audience can find your work.
                    </p>
                </div>

                <div className="grid gap-5">
                    {socialFields.map(([key, label, placeholder]) => (
                        <div className="grid gap-2.5" key={key}>
                            <Label htmlFor={`social_links_${key}`}>
                                {label}
                            </Label>
                            <Input
                                id={`social_links_${key}`}
                                name={`social_links[${key}]`}
                                type="url"
                                defaultValue={creator.socialLinks[key] ?? ''}
                                maxLength={2048}
                                placeholder={placeholder}
                            />
                            <InputError
                                message={errors[`social_links.${key}`]}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
