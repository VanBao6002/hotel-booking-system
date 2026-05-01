import { errorTemplate } from "../components/templates/error.template.js";
import { profileTemplate } from "../components/templates/profile.template.js"
import { changePasswordTemplate } from "../components/templates/change-password..template.js"
const routers = {};
let currentPath = null;

const rules = [
    {
        path: ["#home"],
        roles: ["guest", "USER", "STAFF", "ADMIN"],
        item: ["searchHotel", "discount", "guess"]
    },
    {
        path: ["#home-manager"],
        roles: ["STAFF", "ADMIN"],
        item: []
    },
    {
        path: ["#users-management"],
        roles: ["ADMIN"],
        item: []
    },
    {
        path: ["#search-hotel"],
        roles: ["guest", "USER", "STAFF", "ADMIN"],
        item: ["home"]
    },
    {
        path: ["#booking"],
        roles: ["USER"],
        item: ["genaral","room","location","service","rate"]
    },
    {
        path: ["#setting"],
        roles: ["USER", "STAFF", "ADMIN"],
        item: ["profile","changePassword","home"]
    },
    {
        path: ["#error"],
        roles: ["guest", "USER", "STAFF", "ADMIN"],
        item: []
    }
]



const searchHotel = function navSearchItem() {
    return `
        <div class="header__navbar-link header__navbar-link-search">
            <div class="header__navbar-item">Tìm kiếm</div>
        </div>
    `;
}
const discount = function navDiscountItem() {
    return `
        <div class="header__navbar-link header__navbar-link-discount">
            <div class="header__navbar-item">Khuyến mãi</div>
        </div>
    `;
}
const guess = function navGuessItem() {
    return `
        <div class="header__navbar-link header__navbar-link-guess">
            <div class="header__navbar-item">Gợi ý</div>
        </div>
    `;
}
const home = function navHomeItem() {
    return `
        <div class="header__navbar-link header__navbar-link-home">
            <div class="header__navbar-item">Trang chủ</div>
        </div>
    `;
}
const genaral = function navGenaral() {
    return `
        <div class="header__navbar-link header__navbar-link-genaral">
            <div class="header__navbar-item">Tổng quan</div>
        </div>
    `;
}

const room = function navRoom() {
    return `
        <div class="header__navbar-link header__navbar-link-room">
            <div class="header__navbar-item">Phòng</div>
        </div>
    `;
}
const location = function navLocation() {
    return `
        <div class="header__navbar-link header__navbar-link-location">
            <div class="header__navbar-item">Địa điểm</div>
        </div>
    `;
}
const service = function navService() {
    return `
        <div class="header__navbar-link header__navbar-link-service">
            <div class="header__navbar-item">Dịch vụ</div>
        </div>
    `;
}
const rate = function navRate() {
    return `
        <div class="header__navbar-link header__navbar-link-rate">
            <div class="header__navbar-item">Đánh giá</div>
        </div>
    `;
}
const profile = function navProfile() {
    return `
        <div class="header__navbar-link header__navbar-link-profile">
            <div class="header__navbar-item">Cá nhân</div>
        </div>
    `;
}
const changePassword = function navChangePassword() {
    return `
        <div class="header__navbar-link header__navbar-link-change-password">
            <div class="header__navbar-item">Đổi mật khẩu</div>
        </div>
    `;
}
const navComponents = {
  searchHotel,
  discount,
  guess,
  home,
  genaral,
  room,
  location,
  service,
  rate,
  profile,
  changePassword
};

export function addRoute(path, handler) {
    routers[path] = handler;
}

function renderRoute(path) {

    const role = localStorage.getItem("role");
    console.log(role);

    if(path !== "#error") {
        const matchedRole = rules.find(rule => rule.path.includes(path));
        if(matchedRole) {
            if(matchedRole.roles.includes(role)) {
                console.log(1);
                const handler = routers[path];
                if(handler) {
                    handler();
                }
            }
            else {
                const main = document.querySelector(".main");
                main.innerHTML = errorTemplate(); 
            }
        } 
    }
    else {
        if(handler) {
            handler();
        }
    }

}

export function navigation(path) {
    if(path === window.location.hash) {
        return;
    }
    window.location.hash = path;
    renderRoute(window.location.hash);
    renderNav(window.location.hash);
    attachNavEvents();
}

function renderNav(path) {

    const role = localStorage.getItem("role");
    
    const nav = document.querySelector(".header__navbar-list");
    if(nav) {
        nav.innerHTML = "";
        rules.filter(rule => {
            if(rule.path.includes(path)) {
                if(rule.roles.includes(role)) {
                    rule.item.forEach(item => {
                        const componentFn = navComponents[item];
                        if (componentFn) {
                            nav.innerHTML += componentFn();
                        }
                    }) 
                }
            }
        });
    }
}


function attachNavEvents() {
    
    const main = document.querySelector(".main");

    const homeEl = document.querySelector(".header__navbar-link-home");
    const searchHotelEl = document.querySelector(".header__navbar-link-search");
    const discountEl = document.querySelector(".header__navbar-link-discount");
    const guessEl = document.querySelector(".header__navbar-link-guess");
    const genaralEl = document.querySelector(".header__navbar-link-genaral");
    const roomEl = document.querySelector(".header__navbar-link-room");
    const locationEl = document.querySelector(".header__navbar-link-location");
    const serviceEl = document.querySelector(".header__navbar-link-service");
    const rateEl = document.querySelector(".header__navbar-link-rate");
    const profileEl = document.querySelector(".header__navbar-link-profile");
    const changePasswordEl = document.querySelector(".header__navbar-link-change-password");



    if(homeEl) {
        homeEl.addEventListener("click", () => {
            console.log(window.location.hash)
            navigation("#home");
        })
    }

    if(searchHotelEl) {
        searchHotelEl.addEventListener("click", () => {
            main.querySelector(".booking-search").scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
    if(discountEl) {
        discountEl.addEventListener("click", () => {
            main.querySelector(".advertising-banner").scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
    if(guessEl) {
        guessEl.addEventListener("click", () => {
            main.querySelector(".popular-destinations").scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
    if(genaralEl) {
        genaralEl.addEventListener("click", () => {
            main.querySelector(".booking__info-genaral").scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
    if(roomEl) {
        roomEl.addEventListener("click", () => {
            main.querySelector(".booking__info-room").scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
    if(locationEl) {
        locationEl.addEventListener("click", () => {
            main.querySelector(".booking__info-location").scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
    if(serviceEl) {
        serviceEl.addEventListener("click", () => {
            main.querySelector(".booking__info-service").scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
    if(rateEl) {
        rateEl.addEventListener("click", () => {
            main.querySelector(".booking__info-rate").scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
    if(profileEl) {
        profileEl.addEventListener("click", () => {
            main.querySelector(".setting").innerHTML = profileTemplate();
        })
    }
    if(changePasswordEl) {
        changePasswordEl.addEventListener("click", () => {
            main.querySelector(".setting").innerHTML = changePasswordTemplate();
        })
    }

}







export function initRouter() {

    window.addEventListener("hashchange", () => {
        currentPath = window.location.hash;
        renderRoute(window.location.hash);
        renderNav(window.location.hash);
        attachNavEvents();
    });

    if(!window.location.hash) {
        window.location.hash = "#home";
    }

    // if (!window.location.hash || window.location.hash === "" || window.location.hash === "#home") {
    //     window.location.hash = "#users-management";
    // }

    currentPath = window.location.hash;
    renderRoute(currentPath || "#home");
    renderNav(currentPath || "#home");

    attachNavEvents();
}