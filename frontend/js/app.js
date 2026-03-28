import { initHeader } from "./components/header.js";
import { initBookingSearch } from "./components/booking-search.js";
import { initAdvertisingBanner } from "./components/advertising-banner.js";

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initBookingSearch();
    initAdvertisingBanner();
})