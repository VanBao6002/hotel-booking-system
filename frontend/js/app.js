import { initHeader } from "./components/logics/header.js";
import { initBookingSearch } from "./components/logics/booking-search.js";
import { initAdvertisingBanner } from "./components/logics/advertising-banner.js";
import { initPopularDestinations } from "./components/logics/popular-destinations.js";


import { addRoute, initRouter } from "./router/router.js";

import { headerTemplate } from "./components/templates/header.template.js";
import { homeTemplate } from "./components/templates/home.template.js";
import { footerTemplate } from "./components/templates/footer.template.js";
import { modalTemplate } from "./components/templates/modal.template.js";





document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector(".app");
    
    
    app.innerHTML = `
        ${headerTemplate()}
        <div class="main"></div>
        ${footerTemplate()}
        ${modalTemplate()}
    `;
    
    
    const main = document.querySelector(".main");

    
    addRoute("#home", () => {
        main.innerHTML = homeTemplate();
        initBookingSearch();
        initAdvertisingBanner();
        initPopularDestinations();
    });


    initHeader();
    initRouter();
})

