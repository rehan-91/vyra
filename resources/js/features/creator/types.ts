export type CreatorIdentity = {
    id: number;
    handle: string;
    displayName: string;
    bio: string | null;
    profileVisibility: 'private' | 'public';
    socialLinks: Record<string, string>;
    publicUrl: string;
};
