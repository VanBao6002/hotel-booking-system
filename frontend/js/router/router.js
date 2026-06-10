import { errorTemplate } from "../components/templates/error.template.js";
import { profileTemplate } from "../components/templates/profile.template.js"
import { changePasswordTemplate } from "../components/templates/change-password.template.js"
import { initProfile } from "../components/logics/profile.js";
import { initChangePassword } from "../components/logics/change-password.js";
import { showAppDialog } from "../utils/app-dialog.js";
const routers = {};
let currentPath = null;
let isRevertingHash = false;

const rules = [
    {
        path: ["#home"],
        roles: ["guest", "customer", "staff", "manager"],
        item: ["searchHotel", "discount", "guess"]
    },
    {
        path: ["#home-manager"],
        roles: ["manager"],
        item: []
    },
    {
        path: ["#home-staff"],
        roles: ["staff"],
        item: []
    },
    {
        path: ["#users-management"],
        roles: ["manager"],
        item: []
    },
    {
        path: ["#search-hotel"],
        roles: ["guest", "customer", "staff", "manager"],
        item: ["home"]
    },
    {
        path: ["#booking"],
        roles: ["customer","staff", "manager","guest"
        ],
        item: ["genaral","room","location","service","rate"]
    },
    {
        path: ["#setting"],
        roles: ["customer", "staff", "manager"],
        item: []
    },
    {
        path: ["#change-password"],
        roles: ["customer", "staff", "manager"],
        item: []
    },
    {
        path: ["#booking-history"],
        roles: ["customer","staff", "manager"],
        item: ["home"]
    },
    {
        path: ["#error"],
        roles: ["guest", "customer", "staff", "manager"],
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
const confirm = function navConfirm() {
    return `
        <div class="header__navbar-link header__navbar-link-confirm">
            <div class="header__navbar-item">Xác nhận</div>
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
  confirm,
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
    const handler = routers[path];

    if(path !== "#error") {
        const matchedRole = rules.find(rule => rule.path.includes(path));
        if(matchedRole) {
            if(matchedRole.roles.includes(role)) {
                console.log(1);
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

async function shouldBlockNavigation() {
    const guard = window.__profileUnsavedGuard;
    if (!guard || typeof guard.hasChanges !== "function" || !guard.hasChanges()) {
        return false;
    }

    const choice = await showAppDialog({
        title: "Thông tin chưa được lưu",
        message: "Bạn đã chỉnh sửa thông tin cá nhân nhưng chưa lưu. Bạn muốn xử lý thay đổi này như thế nào?",
        actions: [
            { label: "Lưu và tiếp tục", value: "save", primary: true },
            { label: "Rời đi không lưu", value: "discard", danger: true },
            { label: "Ở lại", value: "stay" },
        ],
    });

    if (choice === "save") {
        const saved = await guard.save?.();
        return !saved;
    }

    if (choice === "discard") {
        guard.clear?.();
        return false;
    }

    return true;
}

export async function navigation(path) {
    if(path === window.location.hash) {
        return;
    }
    if (await shouldBlockNavigation()) {
        return;
    }
    window.location.hash = path;
    currentPath = path;
    renderRoute(path);
    renderNav(path);
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
    const confirmEl = document.querySelector(".header__navbar-link-confirm");
    const serviceEl = document.querySelector(".header__navbar-link-service");
    const rateEl = document.querySelector(".header__navbar-link-rate");
    const profileEl = document.querySelector(".header__navbar-link-profile");
    const changePasswordEl = document.querySelector(".header__navbar-link-change-password");



    if(homeEl) {
        homeEl.onclick = () => {
            console.log(window.location.hash)
            navigation("#home");
        };
    }

    if(searchHotelEl) {
        searchHotelEl.onclick = () => {
            main.querySelector(".booking-search").scrollIntoView({behavior: "smooth", block: "center"});
        };
    }
    if(discountEl) {
        discountEl.onclick = () => {
            main.querySelector(".advertising-banner").scrollIntoView({behavior: "smooth", block: "center"});
        };
    }
    if(guessEl) {
        guessEl.onclick = () => {
            main.querySelector(".popular-destinations").scrollIntoView({behavior: "smooth", block: "center"});
        };
    }
    if(genaralEl) {
        genaralEl.onclick = () => {
            main.querySelector(".booking__info-genaral").scrollIntoView({behavior: "smooth", block: "center"});
        };
    }
    if(roomEl) {
        roomEl.onclick = () => {
            main.querySelector(".booking__info-room").scrollIntoView({behavior: "smooth", block: "center"});
        };
    }
    if(confirmEl) {
        confirmEl.onclick = () => {
            main.querySelector(".booking__info-confirm").scrollIntoView({behavior: "smooth", block: "center"});
        };
    }
    if(serviceEl) {
        serviceEl.onclick = () => {
            main.querySelector(".booking__info-service").scrollIntoView({behavior: "smooth", block: "center"});
        };
    }
    if(rateEl) {
        rateEl.onclick = () => {
            main.querySelector(".booking__info-rate").scrollIntoView({behavior: "smooth", block: "center"});
        };
    }
    if(profileEl) {
        profileEl.onclick = () => {
            main.querySelector(".setting").innerHTML = profileTemplate();
            initProfile();
        };
    }
    if(changePasswordEl) {
        changePasswordEl.onclick = () => {
            main.querySelector(".setting").innerHTML = changePasswordTemplate();
            initChangePassword();
        };
    }

}







export function initRouter() {

    window.onhashchange = async () => {
        const nextPath = window.location.hash;
        if (isRevertingHash) {
            isRevertingHash = false;
            return;
        }
        if (nextPath === currentPath) return;
        if (await shouldBlockNavigation()) {
            isRevertingHash = true;
            window.location.hash = currentPath || "#home";
            return;
        }
        currentPath = nextPath;
        renderRoute(nextPath);
        renderNav(nextPath);
        attachNavEvents();
    };

    if(!window.location.hash) {
        window.location.hash = "#home";
    }

    currentPath = window.location.hash;
    renderRoute(currentPath || "#home");
    renderNav(currentPath || "#home");

    attachNavEvents();
}
