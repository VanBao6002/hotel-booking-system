import { navigation } from "../../router/router.js";
import { userLogin, userRegister } from "../../services/authentication.js";
import { getMe, forgotPassword, resetPassword } from "../../services/users.js";
import { isValidEmail, isValidPassword, isValidUsername, isValidPhoneNumber } from "../../utils/utils.js";
import { showAppDialog } from "../../utils/app-dialog.js";

// global var

const emailField = {
    selector: "#email",
    validate: function(value) {
        return isValidEmail(value) || isValidPhoneNumber(value);
    },
    message: "Không đúng định dạng email hoặc số điện thoại"
}

const passwordField = {
    selector: "#password",
    validate: function(password) {
        return password != "" ? true : false;
    },
    message: "Chưa nhập mật khẩu"
}

const fullnameField = {
    selector: "#fullname",
    validate: function(fullname) {
        return fullname != "" ? true : false;
    },
    message: "Chưa nhập Họ và Tên"
}

const usernameField = {
    selector: "#username",
    validate: isValidUsername,
    message: "Tên người dùng phải có độ dài từ 3 đến 16 ký tự, chỉ được phép chứa chữ cái, chữ số hoặc dấu gạch dưới, và không được bắt đầu bằng số hoặc dấu gạch dưới"
}

const phoneNumberField = {
    selector: "#phone-number",
    validate: isValidPhoneNumber,
    message: "Số điện thoại không hợp lệ"
}

const passwordFieldSIgnUp = {
    selector: "#password",
    validate: isValidPassword,
    message: "Mật khẩu mạnh, tối thiểu 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt"
}

// Dùng cho form sign-up
const confirmPasswordField = {
    selector: "#confirm-password",
    validate: function(confirmPassword) {
        const password = document.querySelector("#form-sign-up #password");
        return confirmPassword === password.value;
    },
    message: "Mật khẩu không khớp"
}

// Dùng cho form reset-password
const confirmPasswordResetField = {
    selector: "#confirm-password",
    validate: function(confirmPassword) {
        const password = document.querySelector("#form-reset-password #password");
        return confirmPassword === password.value;
    },
    message: "Mật khẩu không khớp"
}
const otpField = {
    selector: "#otp",
    validate: function(otp) {
        return otp.trim() !== "" && /^\d{6}$/.test(otp);
    },
    message: "Mã OTP phải là chuỗi gồm 6 chữ số"
}

// Su kien Dang nhap/ Dang ky

const getModal = () => { return document.querySelector(".modal"); }
const getSignInForm = () => { return document.querySelector("#form-sign-in");}
const getSignUpForm = () => { return document.querySelector("#form-sign-up");}
const getForgotPasswordForm = () => { return document.querySelector(".forgot-password__form");}
const  getRessetPasswordForm = () => { return document.querySelector(".reset-password__form");}
const getModalOverlay = () => { return document.querySelector(".modal .modal__overlay");}



export function turnOffModal() {
    getModal().classList.remove('active');
}

function turnOnModal() {
    getModal().classList.add('active');
}




export function showForm(type) {
    const isSignIn = type;
    if(isSignIn === "sign-in") {
        getSignInForm().style.display = "block";
        getSignUpForm().style.display = "none";
        getForgotPasswordForm().style.display = "none";
        getRessetPasswordForm().style.display = "none";
    }
    else if(isSignIn === "sign-up") {
        getSignInForm().style.display = "none";
        getSignUpForm().style.display = "block";
        getForgotPasswordForm().style.display = "none";
        getRessetPasswordForm().style.display = "none";
    }
    else if(isSignIn === "forgot-password") {
        getSignInForm().style.display = "none";
        getSignUpForm().style.display = "none";
        getForgotPasswordForm().style.display = "block";
        getRessetPasswordForm().style.display = "none";
    }
    else if(isSignIn === "reset-password") {
        getSignInForm().style.display = "none";
        getSignUpForm().style.display = "none";
        getForgotPasswordForm().style.display = "none";
        getRessetPasswordForm().style.display = "block";
    }
    getModal().querySelectorAll(".form-group").forEach(e => {
        e.querySelector(".form-error").innerText = "";
        e.querySelector("input").value = "";
        e.classList.remove("invalid");
    });
}

function userExtra() {
    const userInfo = document.querySelector(".user__info");
    const userSignOut = userInfo.querySelector(".extra__item-sign-out");
    const userSetting = userInfo.querySelector(".extra__item-setting");
    const userChangePassword = userInfo.querySelector(".extra__item-change-password");
    const userManage = userInfo.querySelector(".extra__item-manage");
    
    updateManageMenuVisibility();
    


    userSetting.onmousedown = (e) => {
        navigation("#setting");
    };

    userChangePassword?.addEventListener("click", () => {
        navigation("#change-password");
    });

    userManage?.addEventListener("click", () => {
        // userInfoExtra.style.display = "none";
        const role = localStorage.getItem("role");
        if (role === "manager") {
            navigation("#home-manager");
        } else if (role === "staff") {
            navigation("#home-staff");
        }
    });

    
    userSignOut.onclick = async () => {
        const guard = window.__profileUnsavedGuard;
        if (guard?.hasChanges?.()) {
            const choice = await showAppDialog({
                title: "Thông tin chưa được lưu",
                message: "Bạn đã chỉnh sửa thông tin cá nhân nhưng chưa lưu. Bạn muốn lưu thay đổi trước khi đăng xuất không?",
                actions: [
                    { label: "Lưu rồi đăng xuất", value: "save", primary: true },
                    { label: "Đăng xuất không lưu", value: "discard", danger: true },
                    { label: "Ở lại", value: "stay" },
                ],
            });

            if (choice === "save") {
                const saved = await guard.save?.();
                if (!saved) return;
            } else if (choice === "discard") {
                guard.clear?.();
            } else {
                return;
            }
        }
        document.querySelector(".header__navbar-user").classList.remove("logged-in");
        localStorage.setItem("role", "guest");
        localStorage.setItem("token", "");
        localStorage.setItem("userData", "");
        updateManageMenuVisibility();
        localStorage.setItem("choicedHotelId", "");
        localStorage.setItem("searchInfoData", "");
        localStorage.setItem("hotelData", "");
        localStorage.setItem("bookingHistoryData", "");
        localStorage.setItem("bookingDetailData", "");
        localStorage.setItem("paymentData", "");
        localStorage.setItem("bookingData", "");
        localStorage.setItem("currentBookingData", "");
        localStorage.setItem("currentBookingDetailData", "");
        localStorage.setItem("currentPaymentData", "");
        localStorage.setItem("currentUserData", "");
        localStorage.setItem("currentHotelData", "");
        localStorage.setItem("currentSearchInfoData", "");
        localStorage.setItem("currentHotelData", "");
        navigation("#home");
    };
}

function updateManageMenuVisibility() {
    const manageItem = document.querySelector(".extra__item-manage");
    const extraMenu = document.querySelector(".user__info-extra");
    const role = localStorage.getItem("role");
    const canManage = role === "manager" || role === "staff";
    if (manageItem) {
        manageItem.style.display = canManage ? "block" : "none";
    }
    extraMenu?.classList.toggle("has-management", canManage);
}

export function hideAllForm() {
    getSignInForm().style.display = "none";
    getSignUpForm().style.display = "none";
    document.querySelector(".show-room").classList.remove("show");
    document.querySelector(".show__notification").classList.remove("show");
}


function attachValidation(formID, rules) {
    const form = document.getElementById(formID);

    rules.forEach(rule => {
        const filed = form.querySelector(rule.selector);
        const inputGroup = filed.closest(".form-group");
        const errorMessage = inputGroup.querySelector(".form-error");

        filed.onblur = () => {
            if(!rule.validate(filed.value)) {
                inputGroup.classList.add("invalid");
                errorMessage.innerText = rule.message;
            }
            else {
                inputGroup.classList.remove("invalid");
                errorMessage.innerText = "";
            }
        };
    })
}


function validateForm(formID,rules) {
    const form = document.getElementById(formID);
    let isValid = true;

    rules.forEach(rule => {
        const filed = form.querySelector(rule.selector);
        const inputGroup = filed.closest(".form-group");
        const errorMessage = inputGroup.querySelector(".form-error");

        if(!rule.validate(filed.value)) {
            inputGroup.classList.add("invalid");
            errorMessage.innerText = rule.message;
            isValid = false;
        }
        else {
            inputGroup.classList.remove("invalid");
            errorMessage.innerText = "";
        }
    })
    return isValid
}

function showToast(message, type = "success") {
    const toast = document.querySelector(".toast");
    toast.classList.add("show");
    toast.classList.add(type);
    const toastBody = toast.querySelector(".toast__body span");
    toastBody.innerText = message;


    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.remove(type);
        toastBody.innerText = "";
    },3000);
}
function showBookingHistory() {
    const bookingHistory = document.querySelector(".header__navbar-extras-booking");
    bookingHistory.onclick = () => {
        navigation("#booking-history");
    };
}

function attachHomeBrandNavigation() {
    document.querySelector(".header__navbar-logo-link")?.addEventListener("click", (event) => {
        event.preventDefault();
        navigation("#home");
    });

    document.querySelector(".header__navbar-title")?.addEventListener("click", () => {
        navigation("#home");
    });
}


function submitForm(){
    const submitButton = getModal().querySelectorAll(".confirm-btn");
    let phoneNumberToResetPassword = "";

    // sign in

    submitButton[0].onclick = (e)=> {
        e.preventDefault();
        
        const isValid = validateForm("form-sign-in",[emailField,passwordField]);

        if(!isValid ) {
            console.log("fail");
        }
        else {
            console.log("success");
            const form = getSignInForm();
            const userData = {
                phoneNumberOrEmail: form.querySelector("#email").value,
                password: form.querySelector("#password").value
            }

            userLogin(userData)
                .then(data => {
                    console.log("Success(login)");
                    const role = (data?.user?.role || "customer").toString().toLowerCase();
                    localStorage.setItem("role", role);
                    localStorage.setItem("token", data.accessToken);
                    localStorage.setItem("userData", JSON.stringify(data.user || {}));
                    console.log(localStorage.getItem("role"));
                    console.log(localStorage.getItem("token"));
                    document.querySelector(".header__navbar-user").classList.add("logged-in");
                    document.querySelector(".user__info-name span").innerText = data.user.fullName;
                    updateManageMenuVisibility();
                    showToast("Đăng nhập thành công");
                    // navigation("#home");
                    getMe()
                        .then(userData => {
                            localStorage.setItem("userData", JSON.stringify(userData));
                        })
                        .catch(error => {
                            console.log("Failed to fetch user data after login", error);
                            localStorage.setItem("userData", JSON.stringify({}));
                        });

                })
                .catch(errorData => {
                    console.log("fail(login)");
                    showToast(`Đăng nhập thất bại: ${errorData.data.message}`,"error");
                })
            
                turnOffModal();
                hideAllForm();
        }

    };
    
    submitButton[1].onclick = (e) => {
        e.preventDefault();
        

        const isValid = validateForm("form-sign-up",
            [fullnameField,
                usernameField,
                emailField,
                phoneNumberField,
                passwordFieldSIgnUp,
                confirmPasswordField])
        if(!isValid) {
            console.log("fail");
        }
        else {
            console.log("success");
            const form = getSignUpForm();

            const userData = {
                userName: form.querySelector("#username").value,
                password: form.querySelector("#password").value,
                email: form.querySelector("#email").value,
                fullName: form.querySelector("#fullname").value,
                phoneNumber: form.querySelector("#phone-number").value
            };

            userRegister(userData)
                .then(data => {
                    console.log("Success(register)");
                    showToast("Đăng ký thành công");                    
                    turnOffModal();
                    hideAllForm();
                })
                .catch(errorData => {
                    console.log("fail(register)");
                    if(errorData.status) {
                        showToast(`Đăng ký thất bại: ${errorData.data.message}`,"error");
                    }
                    else {
                        showToast("Kết nối tới server thất bại","error");
                    }
                })
        }
    };

    submitButton[2].onclick = (e) => {
        e.preventDefault();

        const invalid = validateForm("form-forgot-password", [phoneNumberField]);
        if(!invalid) {
            console.log("Invalid phone number");
            return;
        }
        else {
            console.log("Submit forgot password form");
            
            const form = getForgotPasswordForm();
            const phoneNumberData = {
                phoneNumber: form.querySelector("#phone-number").value.trim()
            };

            forgotPassword(phoneNumberData)
                .then(() => {
                    console.log("Forgot password form submitted successfully");
                    phoneNumberToResetPassword = phoneNumberData.phoneNumber;
                    showToast("Mã OTP đã được gửi đến số điện thoại của bạn");
                    // turnOffModal();
                    hideAllForm();
                    // show form reset password
                    showForm("reset-password");
                })
                .catch(error => {
                    console.log("Failed to submit forgot password form", error);
                    showToast("Đã xảy ra lỗi khi gửi yêu cầu", "error");
                    phoneNumberToResetPassword = "";
                });
        }

    }
    submitButton[3].onclick = (e) => {
        e.preventDefault();
        
        const isValid = validateForm("form-reset-password", [otpField, passwordFieldSIgnUp, confirmPasswordResetField]);

        if(!isValid) {
            console.log("Invalid reset password form");
            return;
        }
        else {
            console.log("Submit reset password form");

            const form = getRessetPasswordForm();

            const resetData = {
                phoneNumber: phoneNumberToResetPassword,
                resetOtp: form.querySelector("#otp").value.trim(),
                newPassword: form.querySelector("#password").value.trim()
            };

            console.log("Reset password data:", resetData);

            resetPassword(resetData)
                .then(() => {
                    console.log("Reset password successfully");
                    showToast("Mật khẩu của bạn đã được đặt lại thành công");
                    phoneNumberToResetPassword = "";
                    turnOffModal();
                    hideAllForm();
                })
                .catch(error => {
                    console.log("Failed to reset password", error);
                    showToast("Đã xảy ra lỗi khi đặt lại mật khẩu", "error");
                });
        }
    }

    console.log(getSignInForm().querySelectorAll(".form-input"));
}



export function initHeader() {
    getModalOverlay().onclick = () => {
        turnOffModal();
        hideAllForm();
    };

    document.querySelector('.auth__btn-login').onclick = () => {
        turnOnModal();
        showForm("sign-in");
    };
    document.querySelector('.auth__btn-regist').onclick = () => {
        turnOnModal();
        showForm("sign-up");
    };
    document.querySelector(".fp-sign-in-btn").onclick = () => {
        turnOnModal();
        showForm("sign-in");
    }
    document.querySelector(".rp-sign-in-btn").onclick = () => {
        turnOnModal();
        showForm("sign-in");
    };
    document.querySelector(".sign-in-btn").onclick = () => {
        showForm("sign-in");
    };
    document.querySelector(".sign-up-btn").onclick = () => {
        showForm("sign-up");
    };
    document.querySelector(".fogot-password").onclick = () => {
        showForm("forgot-password");
    }

    userExtra();
    attachValidation("form-sign-in",[emailField,passwordField]);
    attachValidation("form-sign-up",[fullnameField,usernameField,emailField,phoneNumberField,passwordFieldSIgnUp,confirmPasswordField]);
    attachValidation("form-forgot-password",[phoneNumberField]);
    attachValidation("form-reset-password",[otpField,passwordFieldSIgnUp,confirmPasswordResetField]);
    submitForm();
    showBookingHistory();
    attachHomeBrandNavigation();
}
