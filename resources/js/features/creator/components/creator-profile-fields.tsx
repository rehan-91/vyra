import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreatorIdentity } from '@/features/creator/types';

type Props = {
    creator?: CreatorIdentity;
    errors: Record<string, string | undefined>;
};

export default function CreatorProfileFields({ creator, errors }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-2.5">
                <Label htmlFor="display_name">Creator name</Label>
                <Input
                    id="display_name"
                    name="display_name"
                    defaultValue={creator?.displayName}
                    autoComplete="nickname"
                    maxLength={100}
                    required
                    placeholder="The name your audience will recognize"
                />
                <InputError message={errors.display_name} />
            </div>

            <div className="grid gap-2.5">
                <Label htmlFor="handle">Creator handle</Label>
                <Input
                    id="handle"
                    name="handle"
                    defaultValue={creator?.handle}
                    autoComplete="off"
                    maxLength={30}
                    required
                    placeholder="your_creator_name"
                />
                <p className="text-muted-foreground text-xs">
                    3–30 lowercase letters, numbers, dashes, or underscores.
                </p>
                <InputError message={errors.handle} />
            </div>

            <div className="grid gap-2.5">
                <Label htmlFor="bio">
                    Short bio{' '}
                    <span className="text-muted-foreground font-normal">
                        (optional)
                    </span>
                </Label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={creator?.bio ?? ''}
                    maxLength={1000}
                    rows={5}
                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 min-h-32 w-full rounded-xl border bg-[#080b11] px-3.5 py-3 text-sm leading-6 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.025)] transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:ring-[3px]"
                    placeholder="Tell people what you create."
                />
                <InputError message={errors.bio} />
            </div>
        </div>
    );
}
