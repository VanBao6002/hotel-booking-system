import { isValidPassword } from "../../utils/utils.js";
import { changePassword } from "../../services/users.js";
import { navigation } from "../../router/router.js";

function validationChangePassword() {
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
        return false;
    }

    if (currentPasswordInput.value.trim() === "") {
        return false;
    }

    if (!isValidPassword(newPasswordInput.value)) {
        return false;
    }

    if (confirmPasswordInput.value !== newPasswordInput.value) {
        return false;
    }

    return true;
}

function updateSaveButtonState(saveBtn) {
    if (!saveBtn) return;
    saveBtn.classList.toggle("active", validationChangePassword());
}

function attachComparePassword() {
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const saveBtn = document.querySelector(".save-info__btn");

    const errorMessages = {
        newPassword: document.getElementById("newPasswordError"),
        confirmPassword: document.getElementById("confirmPasswordError"),
    };

    const validateNewPassword = () => {
        if (!isValidPassword(newPasswordInput.value)) {
        newPasswordInput.classList.add("error");
        errorMessages.newPassword.textContent =
            "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
        return false;
        }
        newPasswordInput.classList.remove("error");
        errorMessages.newPassword.textContent = "";
        return true;
    };    

    const validateConfirmPassword = () => {
        if (confirmPasswordInput.value === "") {
        confirmPasswordInput.classList.add("error");
        errorMessages.confirmPassword.textContent = "Vui lòng xác nhận mật khẩu.";
        return false;
        }

        if (confirmPasswordInput.value !== newPasswordInput.value) {
        confirmPasswordInput.classList.add("error");
        errorMessages.confirmPassword.textContent = "Mật khẩu xác nhận không khớp.";
        return false;
        }

        confirmPasswordInput.classList.remove("error");
        errorMessages.confirmPassword.textContent = "";
        return true;
    };

    const handleValidation = () => {
        validateNewPassword();
        validateConfirmPassword();
        updateSaveButtonState(saveBtn);
    };

    [currentPasswordInput, newPasswordInput, confirmPasswordInput].forEach((input) => {
        if (!input) return;
        input.addEventListener("input", handleValidation);
        input.addEventListener("blur", handleValidation);
    });

    if (saveBtn) {
        saveBtn.onclick = function () {
        if (!validationChangePassword()) return;

        const changePasswordData = {
            currentPassword: currentPasswordInput.value,
            newPassword: newPasswordInput.value,
        };

        const modal = document.querySelector(".modal");
        const showNotification = modal.querySelector(".show__notification");
        const notificationTitle = showNotification.querySelector(".show__notification-title span");
        const notificationMessage = showNotification.querySelector(".show__notification-text");

        changePassword(changePasswordData)
            .then(() => {
            modal.classList.add("active");
            showNotification.classList.remove("error", "warning", "success", "qrcode");
            showNotification.classList.add("show", "success");
            notificationTitle.innerText = "Thành công!";
            notificationMessage.innerText =
                "Mật khẩu của bạn đã được thay đổi. Vui lòng đăng nhập lại.";

            document
                .querySelector(".header__navbar-user")
                .classList.remove("logged-in");
            try {
                localStorage.setItem("role", "guest");
                localStorage.setItem("token", "");
                localStorage.setItem("userData", "");
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
                navigation("#home");
            } catch (error) {
                console.error(
                "Lỗi khi cập nhật giao diện sau khi thay đổi mật khẩu:",
                error
                );
            }
            })
            .catch((error) => {
            console.error("Lỗi khi thay đổi mật khẩu:", error);
            modal.classList.add("active");
            showNotification.classList.remove("error", "warning", "success", "qrcode");
            showNotification.classList.add("show", "error");
            notificationTitle.innerText = "Thất bại!";
            notificationMessage.innerText =
                "Mật khẩu hiện tại không đúng. Vui lòng thử lại.";
            });
        };
    }
}

export function initChangePassword() {
    attachComparePassword();
}
