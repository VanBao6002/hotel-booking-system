import { isValidPassword } from "../../utils/utils.js";

const changePassword = {
    currentPassword: "",
    newPassword: "",
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


    console.log(newPasswordInput, confirmPasswordInput, errorMessages);

    currentPasswordInput.onblur = function() {
        if (currentPasswordInput.value !== "") {
            currentPasswordInput.classList.add("changed");
            changePassword.currentPassword = currentPasswordInput.value;
        }
        else {
            currentPasswordInput.classList.remove("changed");
            changePassword.currentPassword = "";
        }
        if(validationChangePassword()) {
            saveBtn.classList.add("active");
            confirmChangePassword();
        }
        else {
            saveBtn.classList.remove("active");
        }
    }

    confirmPasswordInput.onblur = function() {
        if (confirmPasswordInput.value === "") {
            confirmPasswordInput.classList.add("error");
            errorMessages.confirmPassword.textContent = "Vui lòng xác nhận mật khẩu.";
        } else if (confirmPasswordInput.value !== newPasswordInput.value) {
            confirmPasswordInput.classList.add("error");
            errorMessages.confirmPassword.textContent = "Mật khẩu xác nhận không khớp.";
        } else {
            confirmPasswordInput.classList.remove("error");
            newPasswordInput.classList.remove("error");
            errorMessages.confirmPassword.textContent = "";
        }
        if(validationChangePassword()) {
            saveBtn.classList.add("active");
            confirmChangePassword();
        }
        else {
            saveBtn.classList.remove("active");
        }
    }
    newPasswordInput.onblur = function() {
        if (!isValidPassword(newPasswordInput.value)) {
            newPasswordInput.classList.add("error");
            errorMessages.confirmPassword.textContent = "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
        }
        if (confirmPasswordInput.value === newPasswordInput.value && newPasswordInput.value === "") {
            confirmPasswordInput.classList.remove("error");
            newPasswordInput.classList.remove("error");
            errorMessages.confirmPassword.textContent = "";
        }
        if(validationChangePassword()) {
            saveBtn.classList.add("active");
            confirmChangePassword();
        }
        else {
            saveBtn.classList.remove("active");
        }
    }
}
function validationChangePassword() {
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    
    let isValid = true;

    if (!isValidPassword(newPasswordInput.value)) {
        isValid = false;
    } else if (confirmPasswordInput.value !== newPasswordInput.value) {
        isValid = false;
    }
    else if (currentPasswordInput.value === "") {
        isValid = false;
    }

    return isValid;
}

function confirmChangePassword() {
    if(validationChangePassword()) {
        // Gọi API để thay đổi mật khẩu
        const confirmBtn = document.querySelector(".save-info__btn");

        confirmBtn.onclick = function() {
            console.log("Mật khẩu hợp lệ. Thực hiện thay đổi mật khẩu.");// thanh cong thi se auto dang xuat
            const changePasswordData = {
                currentPassword: document.getElementById("currentPassword").value,
                newPassword: document.getElementById("newPassword").value
            }
            console.log(changePasswordData);
        }
    }
}

export function initChangePassword() {
    attachComparePassword();
}