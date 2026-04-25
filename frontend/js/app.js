import { initHeader } from "./components/logics/header.js";
import { initBookingSearch } from "./components/logics/booking-search.js";
import { initAdvertisingBanner } from "./components/logics/advertising-banner.js";
import { initPopularDestinations } from "./components/logics/popular-destinations.js";
import { initSearchHotel } from "./components/logics/search-hotel.js";


import { addRoute, initRouter } from "./router/router.js";

import { headerTemplate } from "./components/templates/header.template.js";
import { homeTemplate } from "./components/templates/home.template.js";
import { homeManagerTemplate } from "./components/templates/home-manager.template.js";
import { searchHoteltemplate } from "./components/templates/search-hotel.template.js";
import { bookingTemplate } from "./components/templates/booking.template.js";
import { footerTemplate } from "./components/templates/footer.template.js";
import { profileTemplate } from "./components/templates/profile.template.js";
import { changePasswordTemplate } from "./components/templates/change-password..template.js";
import { toastTemplate } from "./components/templates/toast.template.js";
import { modalTemplate } from "./components/templates/modal.template.js";






document.addEventListener("DOMContentLoaded", () => {
    
    const app = document.querySelector(".app");
    
    if(!localStorage.getItem("role")) {
        localStorage.setItem("role", "guest");
    }
    if(!localStorage.getItem("token")) {
        localStorage.setItem("token", "");
    }
    if(!localStorage.getItem("userData")) {
        localStorage.setItem("userData", "");
    }
    
        
        // <div class="main"></div>
        // ${footerTemplate()}
        // ${modalTemplate()}
    app.innerHTML = `
        ${headerTemplate()}
        
        <div class="main"></div>
        ${toastTemplate()}
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

    addRoute("#home-manager", () => {
        main.innerHTML = homeManagerTemplate();
    });
    
    addRoute("#search-hotel", () => {
        main.innerHTML = searchHoteltemplate();
        initSearchHotel();
    });

    addRoute("#booking", () => {
        main.innerHTML = bookingTemplate();
    });

    addRoute("#setting", () => {
        main.innerHTML = profileTemplate();
    });




    initHeader();
    initRouter();
    
})

