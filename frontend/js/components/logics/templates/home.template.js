import { bookingSearchTemplate } from "./booking-search.template.js";
import { advertisingBannerTemplate } from "./advertising-banner.template.js";
import { popularDestinationsTemplate } from "./popular-destinations.template.js";


export function homeTemplate() {
    return `
        ${bookingSearchTemplate()}
        ${advertisingBannerTemplate()}
        ${popularDestinationsTemplate()}
    `;
}