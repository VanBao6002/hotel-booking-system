import { getUserInfo } from "../../utils/utils.js";

export function headerTemplate() {
    const { signIn, fullName } = getUserInfo();

    return `
        <div class="header" id="main-header">
            <div class="grid">
                <nav class="header__navbar">

                    <!-- Logo + Brand -->
                    <div class="header__navbar-logo">
                        <a href="#" class="header__navbar-logo-link">
                            <img src="assets/images/app-logo.jpg" alt="PTBL Hotel Logo" class="header__navbar-logo-img">
                            <div class="header__navbar-title">PTBL Hotel</div>
                        </a>
                    </div>

                    <!-- Right side -->
                    <div class="header__navbar-user ${signIn}">

                        <!-- My Bookings (logged in) -->
                        <div class="header__navbar-extras">
                            <span class="header__navbar-extras-booking">
                                <i class="fa-regular fa-calendar-check"></i>
                                Đặt Chỗ của tôi
                            </span>
                        </div>

                        <!-- Language -->
                        <div class="header__navbar-language">
                            <img src="assets/images/vn-flag.png" alt="Tiếng Việt" class="header__navbar-select-language-img">
                            <i class="fa-solid fa-caret-down"></i>
                        </div>

                        <!-- Auth -->
                        <div class="header__navbar-user-auth">

                            <!-- User info + Dropdown (logged in) -->
                            <div class="user__info">
                                <div class="user__info-avatar">
                                    <img src="assets/images/default-avt.png" alt="Avatar" class="user__info-avatar-icon">
                                </div>
                                <div class="user__info-name">
                                    <span>${fullName}</span>
                                </div>
                                <div class="user__info-extra">
                                    <div class="user__info-extra-wrap">
                                        <div class="extra__item-setting">
                                            <i class="fa-regular fa-gear"></i>
                                            <span>Cài đặt</span>
                                        </div>
                                        <div class="extra__item-manage">
                                            <i class="fa-regular fa-grid-2"></i>
                                            <span>Quản Lý</span>
                                        </div>
                                        <div class="line"></div>
                                        <div class="extra__item-sign-out">
                                            <i class="fa-regular fa-arrow-right-from-bracket"></i>
                                            <span>Đăng xuất</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Login / Register (logged out) -->
                            <button class="btn auth__btn-login">
                                Đăng Nhập
                            </button>
                            <button class="btn auth__btn-regist">Đăng Ký</button>

                        </div>
                    </div>

                </nav>
            </div>
        </div>
    `;
}
