import { initHeader } from "./components/logics/header.js";
import { initBookingSearch } from "./components/logics/booking-search.js";
import { initAdvertisingBanner } from "./components/logics/advertising-banner.js";
import { initPopularDestinations } from "./components/logics/popular-destinations.js";
import { initSearchHotel } from "./components/logics/search-hotel.js";
import { initUsersManagement } from "./components/logics/users-management.js";
import { initHomeManager } from "./components/logics/home-manager.js";
import { initHomeStaff } from "./components/logics/home-staff.js";

import { addRoute, initRouter } from "./router/router.js";

import { headerTemplate } from "./components/templates/header.template.js";
import { homeTemplate } from "./components/templates/home.template.js";
import { homeManagerTemplate } from "./components/templates/home-manager.template.js";
import { homeStaffTemplate } from "./components/templates/home-staff.template.js";
import { searchHoteltemplate } from "./components/templates/search-hotel.template.js";
import { bookingTemplate } from "./components/templates/booking.template.js";
import { usersManagementTemplate } from "./components/templates/users-management.template.js";
import { hotelsManagementTemplate } from "./components/templates/hotels-management.template.js";
import { financeManagementTemplate } from "./components/templates/finance-management.template.js";
import { footerTemplate } from "./components/templates/footer.template.js";
import { profileTemplate } from "./components/templates/profile.template.js";
import { changePasswordTemplate } from "./components/templates/change-password.template.js";
import { toastTemplate } from "./components/templates/toast.template.js";
import { modalTemplate } from "./components/templates/modal.template.js";
import { initBooking } from "./components/logics/booking.js";
import { bookingHistoryTemplate } from "./components/templates/booking-history.template.js";
import { initBookingHistory } from "./components/logics/booking-history.js";






document.addEventListener("DOMContentLoaded", () => {
    
    const app = document.querySelector(".app");
    
    if(!localStorage.getItem("role")) {
        localStorage.setItem("role", "guest");
    } else {
        const legacyRoleMap = { USER: "customer", ADMIN: "manager", STAFF: "staff" };
        const currentRole = localStorage.getItem("role");
        localStorage.setItem("role", legacyRoleMap[currentRole] || currentRole.toLowerCase());
    }
    if(!localStorage.getItem("token")) {
        localStorage.setItem("token", "");
    }
    if(!localStorage.getItem("userData")) {
        localStorage.setItem("userData", "");
    }
    if(!localStorage.getItem("DuringBooking")) {
        localStorage.setItem("DuringBooking", "false");
    }
    if(!localStorage.getItem("hotelData")) {
        localStorage.setItem("hotelData", "");
    }
    if(!localStorage.getItem("choicedHotelId")) {
        localStorage.setItem("choicedHotelId", "");
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
    main.style.minHeight = `calc(100vh - ${document.querySelector(".header").offsetHeight}px - ${document.querySelector(".footer").offsetHeight}px + 80px)`;

    
    addRoute("#home", () => {
        main.innerHTML = homeTemplate();
        initBookingSearch();
        initAdvertisingBanner();
        initPopularDestinations();
    });

    addRoute("#home-manager", () => {
    const main = document.querySelector(".main");
    if (main) {
        main.innerHTML = homeManagerTemplate();
        initHomeManager(); 
    }
    });

    addRoute("#home-staff", () => {
        const main = document.querySelector(".main");
        if (main) {
            main.innerHTML = homeStaffTemplate();
            initHomeStaff();
        }
    });

    addRoute("#users-management", () => {
        main.innerHTML = usersManagementTemplate();
        initUsersManagement();
    });
    
    addRoute("#search-hotel", () => {
        main.innerHTML = searchHoteltemplate();
        initSearchHotel();
    });

    addRoute("#booking", () => {
        main.innerHTML = bookingTemplate();
        initBooking();
    });

    addRoute("#setting", () => {
        main.innerHTML = profileTemplate();
    });

    addRoute("#booking-history", () => {
        main.innerHTML = bookingHistoryTemplate();
        initBookingHistory();
    })




    initHeader();
    initRouter();
    
})
