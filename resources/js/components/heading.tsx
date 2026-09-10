export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-2'}>
            <h2
                className={
                    variant === 'small'
                        ? 'mb-0.5 text-base font-semibold tracking-tight'
                        : 'font-serif text-3xl font-medium tracking-tight sm:text-4xl'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-muted-foreground max-w-2xl text-sm leading-6">
                    {description}
                </p>
            )}
        </header>
    );
}
