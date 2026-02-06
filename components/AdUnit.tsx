import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
    client?: string;
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
    label?: string; // Internal label for debugging/structure
}

export const AdUnit: React.FC<AdUnitProps> = ({
    client = 'ca-pub-2919389888186154', // Default to the ID found in index.html
    slot,
    format = 'auto',
    responsive = true,
    className = '',
    style = {},
    label
}) => {
    const adRef = useRef<HTMLModElement>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        // Prevent double padding if StrictMode runs twice or re-renders
        if (initializedRef.current) return;

        try {
            // @ts-ignore
            if (window.adsbygoogle && !import.meta.env.DEV) {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                initializedRef.current = true;
            } else if (import.meta.env.DEV) {
                console.log(`[AdSense Dev] Ad Unit '${label || slot}' would load here.`);
            }
        } catch (e) {
            console.error('[AdSense] Error pushing ad:', e);
        }
    }, [slot]);

    return (
        <div className={`ad-container my-8 flex justify-center overflow-hidden ${className}`} style={{ minHeight: '100px', ...style }}>
            {import.meta.env.DEV && (
                <div className="w-full bg-gray-800 border border-yellow-500/30 p-4 text-center text-gray-400 text-xs font-mono rounded-lg">
                    <p className="text-yellow-500 font-bold mb-1">GOOGLE ADSENSE (DEV MODE)</p>
                    <p>Slot ID: {slot}</p>
                    <p>Format: {format}</p>
                    {label && <p>Placement: {label}</p>}
                </div>
            )}

            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', ...style }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
};
