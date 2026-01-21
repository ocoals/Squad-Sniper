import { useEffect } from 'react';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export const GoogleAnalytics = () => {
    useEffect(() => {
        // Only initialize in production and if ID is present
        const gaId = import.meta.env.VITE_GA_ID;
        const isProduction = import.meta.env.PROD;

        if (isProduction && gaId) {
            // Inject the script if not already present
            const scriptId = 'ga-script';
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
                document.head.appendChild(script);

                // Initialize logic
                window.dataLayer = window.dataLayer || [];
                function gtag(...args: any[]) {
                    window.dataLayer.push(args);
                }
                window.gtag = gtag;
                window.gtag('js', new Date());
                window.gtag('config', gaId);
            }
        }
    }, []);

    return null;
};
