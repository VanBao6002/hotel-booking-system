import { changePassword as changePasswordService } from "../../services/users.js";
import { isValidPassword } from "../../utils/utils.js";

function getInputs() {
    return {
        currentPassword: document.getElementById("currentPassword"),
        newPassword: document.getElementById("newPassword"),
        confirmPassword: document.getElementById("confirmPassword"),
    };
}

function getSaveBtn() {
    return document.querySelector(".change-password .save-info__btn");
}

function setMessage(message, type = "success") {
    const el = document.querySelector(".change-password__message");
    if (!el) return;
    el.style.display = message ? "block" : "none";
    el.style.background = type === "error" ? "#fee2e2" : "#dcfce7";
    el.style.color = type === "error" ? "#b91c1c" : "#166534";
    el.style.padding = "10px 12px";
    el.style.borderRadius = "6px";
    el.style.marginBottom = "12px";
    el.textContent = message || "";
}

function setError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
}

function friendlyError(err) {
    if (err?.status === 401) return "Mật khẩu hiện tại không đúng.";
    if (err?.status === 409) return "Mật khẩu mới phải khác mật khẩu hiện tại.";
    return err?.data?.message || "Không thể đổi mật khẩu. Vui lòng thử lại.";
}

function validateChangePassword(showErrors = true) {
    const { currentPassword, newPassword, confirmPassword } = getInputs();
    if (!currentPassword || !newPassword || !confirmPassword) return false;

    let isValid = true;
    if (showErrors) {
        setError("newPasswordError", "");
        setError("confirmPasswordError", "");
    }

    currentPassword.classList.toggle("changed", Boolean(currentPassword.value));

    if (!currentPassword.value) {
        isValid = false;
    }

    if (!isValidPassword(newPassword.value)) {
        isValid = false;
        if (showErrors) {
            newPassword.classList.add("error");
            setError("newPasswordError", "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }
    } else {
        newPassword.classList.remove("error");
    }

    if (!confirmPassword.value) {
        isValid = false;
        if (showErrors) {
            confirmPassword.classList.add("error");
            setError("confirmPasswordError", "Vui lòng xác nhận mật khẩu.");
        }
    } else if (confirmPassword.value !== newPassword.value) {
        isValid = false;
        if (showErrors) {
            confirmPassword.classList.add("error");
            setError("confirmPasswordError", "Mật khẩu xác nhận không khớp.");
        }
    } else {
        confirmPassword.classList.remove("error");
    }

    return isValid;
}

function updateSaveState() {
    const saveBtn = getSaveBtn();
    if (!saveBtn) return;
    saveBtn.classList.toggle("active", validateChangePassword(false));
}

async function submitChangePassword() {
    const saveBtn = getSaveBtn();
    const { currentPassword, newPassword, confirmPassword } = getInputs();
    if (!saveBtn || !validateChangePassword(true)) {
        updateSaveState();
        return;
    }

    saveBtn.classList.remove("active");
    saveBtn.classList.add("loading");
    saveBtn.querySelector("span").textContent = "Đang xử lý...";
    setMessage("");

    try {
        await changePasswordService({
            currentPassword: currentPassword.value,
            newPassword: newPassword.value,
        });

        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
        [currentPassword, newPassword, confirmPassword].forEach(input => {
            input.classList.remove("changed", "error");
        });
        setError("newPasswordError", "");
        setError("confirmPasswordError", "");
        setMessage("Đổi mật khẩu thành công.");
    } catch (err) {
        setMessage(friendlyError(err), "error");
    } finally {
        saveBtn.classList.remove("loading");
        saveBtn.querySelector("span").textContent = "Xác nhận";
        updateSaveState();
    }
}

function attachComparePassword() {
    const { currentPassword, newPassword, confirmPassword } = getInputs();
    const saveBtn = getSaveBtn();
    [currentPassword, newPassword, confirmPassword].forEach(input => {
        input?.addEventListener("input", updateSaveState);
        input?.addEventListener("blur", () => validateChangePassword(true) && updateSaveState());
    });
    saveBtn?.addEventListener("click", submitChangePassword);
}

export function initChangePassword() {
    attachComparePassword();
    updateSaveState();
}
