import { updateMe } from "../../services/users.js";
import { isValidEmail, isValidPhoneNumber, safeJsonParse } from "../../utils/utils.js";

let oldProfile = {};
let newProfile = {};
let isSaving = false;

function readProfileFromStorage() {
    const userData = safeJsonParse(localStorage.getItem("userData"), {});
    return {
        fullName: userData.fullName ?? "",
        username: userData.userName ?? "",
        email: userData.email ?? "",
        dateOfBirth: userData.dateOfBirth ?? "",
        gender: userData.gender ?? "",
        phoneNumber: userData.phoneNumber ?? "",
        address: userData.currentAddress ?? "",
    };
}

function getProfileWrap() {
    return document.querySelector(".profile__wrap");
}

function setMessage(message, type = "success") {
    const el = document.querySelector(".profile__message");
    if (!el) return;
    el.style.display = message ? "block" : "none";
    el.style.background = type === "error" ? "#fee2e2" : "#dcfce7";
    el.style.color = type === "error" ? "#b91c1c" : "#166534";
    el.textContent = message || "";
}

function setFieldError(input, message) {
    const profileWrap = getProfileWrap();
    const errorIdMap = {
        fullName: "fullNameError",
        email: "emailError",
        phoneNumber: "phoneNumberError",
        dateOfBirth: "dateOfBirthError",
    };
    const errorEl = profileWrap?.querySelector(`#${errorIdMap[input.name]}`);
    if (errorEl) errorEl.textContent = message;
    input.classList.toggle("error", Boolean(message));
}

function validateInput(input, showError = true) {
    if (!input) return true;

    if (input.name === "fullName") {
        const message = input.value.trim() ? "" : "Họ và tên không được để trống.";
        if (showError) setFieldError(input, message);
        return !message;
    }

    if (input.name === "email") {
        const message = isValidEmail(input.value.trim()) ? "" : "Định dạng email không hợp lệ.";
        if (showError) setFieldError(input, message);
        return !message;
    }

    if (input.name === "phoneNumber") {
        const message = isValidPhoneNumber(input.value.trim()) ? "" : "Định dạng số điện thoại không hợp lệ.";
        if (showError) setFieldError(input, message);
        return !message;
    }

    if (input.name === "dateOfBirth" && input.value) {
        const selectedDate = new Date(input.value);
        const today = new Date();
        let age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
            age--;
        }
        const message = age < 18 ? "Bạn phải đủ 18 tuổi trở lên." : "";
        if (showError) setFieldError(input, message);
        return !message;
    }

    if (showError) setFieldError(input, "");
    return true;
}

function validateProfile(showErrors = true) {
    const profileWrap = getProfileWrap();
    if (!profileWrap) return false;
    return [...profileWrap.querySelectorAll("input")].every(input => validateInput(input, showErrors));
}

function syncProfileFromInputs() {
    const profileWrap = getProfileWrap();
    profileWrap?.querySelectorAll("input").forEach(input => {
        newProfile[input.name] = input.value;
    });
}

function hasProfileChanged() {
    syncProfileFromInputs();
    return Object.keys(oldProfile).some(key => oldProfile[key] !== newProfile[key]);
}

function updateSaveState() {
    const profileWrap = getProfileWrap();
    const saveBtn = profileWrap?.querySelector(".save-info__btn");
    if (!saveBtn) return;

    const canSave = validateProfile(false) && hasProfileChanged() && !isSaving;
    saveBtn.classList.toggle("active", canSave);
    saveBtn.setAttribute("aria-disabled", String(!canSave));
}

function handleInputChange(input) {
    newProfile[input.name] = input.value;
    input.classList.toggle("changed", oldProfile[input.name] !== input.value);
    validateInput(input);
    updateSaveState();
}

function attachChangeHighlight() {
    const profileWrap = getProfileWrap();
    if (!profileWrap) return;

    profileWrap.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => handleInputChange(input));
        input.addEventListener("change", () => handleInputChange(input));
        input.addEventListener("blur", () => handleInputChange(input));
    });
}

function attachValidation() {
    const profileWrap = getProfileWrap();
    if (!profileWrap) return;

    const dateOfBirthInput = profileWrap.querySelector("#dateofbirth");
    if (dateOfBirthInput) {
        dateOfBirthInput.setAttribute("max", new Date().toISOString().split("T")[0]);
    }

    const genderInput = profileWrap.querySelector("#gender");
    const genderOptions = profileWrap.querySelector(".gender-options");
    genderOptions?.addEventListener("mousedown", (event) => {
        if (!event.target.classList.contains("gender-item") || !genderInput) return;
        genderInput.value = event.target.innerText;
        handleInputChange(genderInput);
    });
}

function lockProfileInputs() {
    const profileWrap = getProfileWrap();
    profileWrap?.querySelectorAll("input").forEach(input => {
        input.classList.remove("changed", "error");
        input.setAttribute("readonly", true);
        input.style.pointerEvents = "none";
    });
    profileWrap?.querySelectorAll(".error-message").forEach(el => {
        el.textContent = "";
    });
}

async function saveProfile({ force = false } = {}) {
    const profileWrap = getProfileWrap();
    const saveBtn = profileWrap?.querySelector(".save-info__btn");
    if (!saveBtn || isSaving) return false;

    if (!force && !saveBtn.classList.contains("active")) return false;

    syncProfileFromInputs();
    if (!validateProfile()) {
        updateSaveState();
        setMessage("Vui lòng kiểm tra lại thông tin trước khi lưu.", "error");
        return false;
    }

    if (!hasProfileChanged()) {
        updateSaveState();
        return true;
    }

    isSaving = true;
    saveBtn.classList.remove("active");
    saveBtn.classList.add("loading");
    saveBtn.querySelector("span").textContent = "Đang lưu...";
    setMessage("");

    try {
        const updated = await updateMe({
            fullName: newProfile.fullName,
            email: newProfile.email,
            dateOfBirth: newProfile.dateOfBirth || null,
            gender: newProfile.gender || null,
            phoneNumber: newProfile.phoneNumber,
            currentAddress: newProfile.address || "",
        });

        localStorage.setItem("userData", JSON.stringify(updated));
        oldProfile = readProfileFromStorage();
        newProfile = { ...oldProfile };

        lockProfileInputs();

        const headerName = document.querySelector(".user__info-name span");
        if (headerName) {
            headerName.textContent = updated.fullName || updated.userName || "";
        }

        setMessage("Cập nhật thông tin cá nhân thành công.");
        return true;
    } catch (err) {
        const message = err?.data?.message || "Không thể cập nhật thông tin cá nhân.";
        setMessage(message, "error");
        return false;
    } finally {
        isSaving = false;
        saveBtn.classList.remove("loading");
        saveBtn.querySelector("span").textContent = "Lưu thông tin";
        updateSaveState();
    }
}

function editProfile() {
    const profileWrap = getProfileWrap();
    const editIcons = profileWrap?.querySelectorAll(".edit") || [];

    editIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const input = icon.nextElementSibling;
            if (!input) return;

            if (input.hasAttribute("readonly")) {
                input.removeAttribute("readonly");
                input.style.pointerEvents = "auto";
                input.focus();
            } else {
                input.setAttribute("readonly", true);
                input.style.pointerEvents = "none";
            }
        });
    });
}

function registerUnsavedGuard() {
    window.__profileUnsavedGuard = {
        hasChanges: () => Boolean(getProfileWrap()) && hasProfileChanged(),
        save: () => saveProfile({ force: true }),
        clear: () => {
            syncProfileFromInputs();
            oldProfile = { ...newProfile };
            window.__profileUnsavedGuard = null;
        },
    };
}

export function initProfile() {
    oldProfile = readProfileFromStorage();
    newProfile = { ...oldProfile };
    editProfile();
    attachValidation();
    attachChangeHighlight();
    getProfileWrap()?.querySelector(".save-info__btn")?.addEventListener("click", () => saveProfile());
    registerUnsavedGuard();
    updateSaveState();
}
