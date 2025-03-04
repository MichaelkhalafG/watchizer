import { useEffect } from "react";

const FacebookPixel = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.defer = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";

        script.onload = () => {
            window.fbq = window.fbq || function () {
                (window.fbq.callMethod)
                    ? window.fbq.callMethod.apply(window.fbq, arguments)
                    : window.fbq.queue.push(arguments);
            };

            if (!window._fbq) window._fbq = window.fbq;
            window.fbq.push = window.fbq;
            window.fbq.loaded = true;
            window.fbq.version = '2.0';
            window.fbq.queue = [];

            window.fbq('init', '1611910119460872');
            window.fbq('track', 'PageView');
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <noscript>
            <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=1611910119460872&ev=PageView&noscript=1"
                alt="Facebook Pixel"
            />
        </noscript>
    );
};

export default FacebookPixel;
