import type { CSSProperties } from 'react';

type VyraLogoProps = {
    variant?: 'full' | 'icon';
    className?: string;
    iconClassName?: string;
    size?: number | string;
    label?: string;
};

/** The approved VYRA artwork lives at public/images/brand/vyra-icon.png. */
export default function VyraLogo({
    variant = 'full',
    className,
    iconClassName,
    size,
    label = 'VYRA',
}: VyraLogoProps) {
    const iconStyle: CSSProperties | undefined = size
        ? { width: size, height: size }
        : undefined;

    return (
        <span
            className={`inline-flex items-center ${variant === 'full' ? 'gap-2.5' : ''} ${className ?? ''}`}
            aria-label={label}
            role="img"
        >
            <img
                src="/images/brand/vyra-icon.png"
                alt=""
                aria-hidden="true"
                className={`block size-8 shrink-0 object-contain ${iconClassName ?? ''}`}
                style={iconStyle}
            />
            {variant === 'full' && (
                <span className="font-serif font-medium tracking-[0.16em] text-inherit">
                    VYRA
                </span>
            )}
        </span>
    );
}
