import { changePassword as changePasswordService } from "../../services/users.js";
import { isValidPassword } from "../../utils/utils.js";
import { navigation } from "../../router/router.js";

/* ─── DOM helpers ────────────────────────────────────────── */
function getInputs() {
    return {
        currentPassword: document.getElementById("currentPassword"),
        newPassword:     document.getElementById("newPassword"),
        confirmPassword: document.getElementById("confirmPassword"),
    };
}

function getSaveBtn() {
    return document.getElementById("cpSaveBtn");
}

/* ─── Animated message banner ───────────────────────────── */
function setMessage(message, type = "success") {
    const el = document.getElementById("cpMessage");
    if (!el) return;

    if (!message) {
        el.classList.remove("visible", "success", "error");
        return;
    }

    el.textContent = message;
    el.classList.remove("success", "error", "visible");

    // Force reflow so transition plays
    void el.offsetWidth;

    el.classList.add(type, "visible");

    // Auto-hide success after 4s
    if (type === "success") {
        setTimeout(() => {
            el.classList.remove("visible");
        }, 4000);
    }
}

/* ─── Inline error messages ─────────────────────────────── */
function setError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    if (message) {
        const wrap = el.closest(".group-info");
        const input = wrap?.querySelector("input");
        if (input) {
            input.classList.remove("error");
            void input.offsetWidth; // reflow
            input.classList.add("error");
        }
    }
}

/* ─── Friendly API error messages ───────────────────────── */
function friendlyError(err) {
    if (err?.status === 401) return "Mật khẩu hiện tại không đúng.";
    if (err?.status === 409) return "Mật khẩu mới phải khác mật khẩu hiện tại.";
    return err?.data?.message || "Không thể đổi mật khẩu. Vui lòng thử lại.";
}

/* ─── Password strength ──────────────────────────────────── */
const STRENGTH_LEVELS = [
    { label: "Rất yếu",    class: "strength-1" },
    { label: "Yếu",        class: "strength-2" },
    { label: "Trung bình", class: "strength-3" },
    { label: "Mạnh",       class: "strength-4" },
];

function calcStrength(password) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8)           score++;
    if (/[A-Z]/.test(password))         score++;
    if (/[0-9]/.test(password))         score++;
    if (/[^A-Za-z0-9]/.test(password))  score++;
    return score; // 0-4
}

function updateStrengthBar(password) {
    const container = document.getElementById("cpStrength");
    const fill      = document.getElementById("cpStrengthFill");
    const label     = document.getElementById("cpStrengthLabel");
    if (!container || !fill || !label) return;

    if (!password) {
        container.style.display = "none";
        fill.className  = "cp-strength__fill";
        label.className = "cp-strength__label";
        label.textContent = "";
        return;
    }

    container.style.display = "block";
    const score = calcStrength(password);
    const level = STRENGTH_LEVELS[score - 1] || STRENGTH_LEVELS[0];

    fill.className  = `cp-strength__fill ${level.class}`;
    label.className = `cp-strength__label ${level.class}`;
    label.textContent = `Độ mạnh: ${level.label}`;
}

/* ─── Eye toggle ──────────────────────────────────────────── */
function initEyeToggles() {
    document.querySelectorAll(".cp-eye-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            if (!input) return;

            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";

            const icon = btn.querySelector("i");
            icon.classList.toggle("fa-eye",       !isPassword);
            icon.classList.toggle("fa-eye-slash",  isPassword);
        });
    });
}

/* ─── Validation ─────────────────────────────────────────── */
function validateChangePassword(showErrors = true) {
    const { currentPassword, newPassword, confirmPassword } = getInputs();
    if (!currentPassword || !newPassword || !confirmPassword) return false;

    let isValid = true;

    if (showErrors) {
        setError("newPasswordError", "");
        setError("confirmPasswordError", "");
    }

    // Current password — mark green when filled
    currentPassword.classList.toggle("changed", Boolean(currentPassword.value));
    if (!currentPassword.value) {
        if (showErrors) currentPassword.classList.add("error");
        isValid = false;
    } else {
        currentPassword.classList.remove("error");
    }

    // New password
    if (!isValidPassword(newPassword.value)) {
        isValid = false;
        if (showErrors) {
            setError("newPasswordError",
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }
    } else {
        newPassword.classList.remove("error");
    }

    // Confirm password
    if (!confirmPassword.value) {
        isValid = false;
        if (showErrors) {
            setError("confirmPasswordError", "Vui lòng xác nhận mật khẩu.");
        }
    } else if (confirmPassword.value !== newPassword.value) {
        isValid = false;
        if (showErrors) {
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
    const valid = validateChangePassword(false);
    saveBtn.classList.toggle("active", valid);
}

/* ─── Submit ─────────────────────────────────────────────── */
async function submitChangePassword() {
    const saveBtn = getSaveBtn();
    const { currentPassword, newPassword, confirmPassword } = getInputs();

    if (!saveBtn || !validateChangePassword(true)) {
        updateSaveState();
        return;
    }

    // Loading state
    saveBtn.classList.remove("active");
    saveBtn.classList.add("loading");
    const btnText = saveBtn.querySelector(".cp-btn-text");
    if (btnText) btnText.textContent = "Đang xử lý...";
    setMessage("");

    try {
        await changePasswordService({
            currentPassword: currentPassword.value,
            newPassword:     newPassword.value,
        });

        // Clear inputs
        [currentPassword, newPassword, confirmPassword].forEach(input => {
            input.value = "";
            input.classList.remove("changed", "error");
            input.type = "password";
        });
        // Reset eye icons
        document.querySelectorAll(".cp-eye-toggle i").forEach(icon => {
            icon.className = "fa-regular fa-eye";
        });

        setError("newPasswordError", "");
        setError("confirmPasswordError", "");
        updateStrengthBar("");

        setMessage("Đổi mật khẩu thành công.", "success");

    } catch (err) {
        setMessage(friendlyError(err), "error");
    } finally {
        saveBtn.classList.remove("loading");
        if (btnText) btnText.textContent = "Xác nhận đổi mật khẩu";
        updateSaveState();
    }
}

/* ─── Init ───────────────────────────────────────────────── */
export function initChangePassword() {
    const { currentPassword, newPassword, confirmPassword } = getInputs();

    initEyeToggles();

    // Live validation + strength bar
    [currentPassword, newPassword, confirmPassword].forEach(input => {
        input?.addEventListener("input", () => {
            if (input.id === "newPassword") {
                updateStrengthBar(input.value);
            }
            updateSaveState();
        });

        input?.addEventListener("blur", () => {
            validateChangePassword(true);
            updateSaveState();
        });
    });

    // Click save
    getSaveBtn()?.addEventListener("click", submitChangePassword);

    updateSaveState();
}