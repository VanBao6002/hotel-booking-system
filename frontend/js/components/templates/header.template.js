export function headerTemplate() {
    let signIn = "";
    let fullName = "";
    const data = localStorage.getItem("userData");
    if(data) {
        const userData = JSON.parse(data);
        if(userData && userData.fullName) {
            signIn = "logged-in";
            fullName = userData.fullName;
        }
    }

    return `
        <div class="header">
            <div class="grid">
            <nav class="header__navbar">
                <div class="header__navbar-logo header__navbar-box">
                    <a href="#" class="header__navbar-logo-link">
                        <img src="assets/images/app-logo.jpg" alt="logo-app" class="header__navbar-logo-img">
                    </a>
                </div>

                <div class="header__navbar-title">
                    <span>PTBL Booking Hotel</span>
                </div>

                <!-- Dang nhap: logged-in -->
                <div class="header__navbar-user ${signIn} ">
                    <div class="header__navbar-extras">
                        <span class="header__navbar-extras-booking">Đặt Chỗ của tôi</span>
                    </div>
                    <div class="header__navbar-language">
                        <img src="assets/images/vn-flag.png" alt="flag" class="header__navbar-select-language-img">
                        <i class="fa-solid fa-caret-down"></i>
                    </div>
                    <div class="header__navbar-user-auth">
                        <div class="user__info">
                            <div class="user__info-avatar">
                                <img src="assets/images/default-avt.png" alt="avatar-icon" class="user__info-avatar-icon">
                            </div>
                            <div class="user__info-name">
                                <span>${fullName}</span>
                            </div>
                            <div class="user__info-extra">
                                <div class="user__info-extra-wrap">
                                    <div class="extra__item-setting"><span>Cài đặt</span></div>
                                    <div class="extra__item-sign-out"><span>Đăng xuất</span></div>
                                    <div class="line"></div>
                                </div>
                            </div>
                        </div>

                        <button class="btn auth__btn-login">
                            Đăng Nhập
                            <i class="fa-solid fa-arrow-right-to-bracket"></i>
                        </button>
                        <button class="btn auth__btn-regist">Đăng Ký</button>
                    </div>
                </div>
            </nav>
            <nav class="header__navbar header__navbar-page-transition">
                <div class="header__navbar-list"></div>           
            </nav>
            </div>
        </div>
    `;
}